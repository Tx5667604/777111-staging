import re
from collections import defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# All brand section start positions
brand_ids = list(re.finditer(r"\n    id: '([^']+)'\n    name: '([^']+)'", content))

# For each brand, find color/region/year variants that are duplicates
# We'll remove the variant with MORE words (color suffix, year suffix, etc.)
removed = 0

current_pos = 0
sections_to_remove = {}  # brand -> list of (line, name, reason)

for m in brand_ids:
    brand = m.group(1)
    name = m.group(2)
    
    # Find end of this brand section
    end_match = re.search(r"\n    ]\n  \},\n  \{\n    id: '", content[m.end():])
    if end_match:
        end_pos = m.end() + end_match.start()
    else:
        end_pos = content.rfind("];")
        if end_pos == -1:
            continue
        end_pos += 2
    
    section = content[m.end():end_pos]
    
    # Extract model code lines with line numbers
    model_entries = list(re.finditer(r"        modelCode: '([^']+)'", section))
    
    # Find groups that differ only by non-essential suffix
    # Build normalized groups
    groups = defaultdict(list)
    for entry in model_entries:
        code = entry.group(1)
        pos = entry.start()
        
        # Normalize: remove color words, year, connectivity, region, etc.
        n = code.lower()
        for word in ['чорна', 'синя', 'червона', 'бронзова', 'сине', 'фіолетова',
                     'чёрная', 'синяя', 'красная', 'бронзовая', 'фиолетовая',
                     'metal', 'atlantic', 'graphite', 'polar', 'ocean', 'teal',
                     'titanium', 'cool', 'sunset', 'red', 'green', 'blue', 'white',
                     'gray', 'gold', 'silver', 'purple', 'pink', 'yellow',
                     'global', 'european', 'china', 'poco', 'power',
                     'viva', 'magenta', 'meteorite', 'mineral', 'misty', 'fresh',
                     'orchid', 'nebula', 'denim']:
            n = n.replace(word, '')
        # Remove size suffixes like 168мм, model codes like DRA-L21
        n = re.sub(r'\d+x\d+|\d{3,4}мм|[a-z0-9]+-[a-z0-9]+', '', n)
        n = re.sub(r'\s+', ' ', n).strip().strip('-').strip()
        
        groups[n].append((pos, code))
    
    # Find groups where some entries are subsumed by others
    for base, entries in groups.items():
        if len(entries) < 2:
            continue
        
        # Sort: shorter name first (likely the base model)
        entries_sorted = sorted(entries, key=lambda x: (len(x[1]), x[0]))
        
        # Check if shorter name is a substring/prefix of longer ones
        shortest = entries_sorted[0][1].lower()
        variants = [e for e in entries_sorted[1:] if shortest in e[1].lower() or e[1].lower() in shortest]
        
        if variants:
            # Keep the shortest, remove the longer ones
            keep = entries_sorted[0]
            for variant in variants:
                # Don't remove if they're different models (e.g., A54 4G vs A54 5G)
                v_code = variant[1]
                if '5G' in v_code and '4G' not in v_code:
                    continue  # 5G variant might be legitimately different
                
                # Mark for removal
                sec_pos = m.end() + variant[0]
                line_no = content[:sec_pos].count('\n') + 1
                sections_to_remove.setdefault(brand, []).append((sec_pos, v_code))
                removed += 1

print(f"Found {removed} potential duplicates to remove by brand:")
for brand, items in sorted(sections_to_remove.items()):
    print(f"\n  {brand}:")
    for pos, code in items:
        print(f"    - {code}")
