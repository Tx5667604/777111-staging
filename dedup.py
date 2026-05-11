#!/usr/bin/env python3
"""
Merge duplicate phone models in phone-parts-data.ts

Duplicates are models that differ only by:
1. Color suffix (Black, Blue, Red, сіра, чорна, etc.)
2. Display type suffix (OLED, TFT, IPS, AMOLED, INCELL, P-OLED)
3. Mixed (color + display type)

Keeps the "base" entry (shortest name without suffix) and removes the rest.
If no base exists, keeps the first entry found.
"""

import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Suffixes to strip (lowercase)
COLOR_SUFFIXES = [
    ' black', ' blue', ' white', ' red', ' green', ' grey', ' gray',
    ' gold', ' silver', ' purple', ' pink', ' orange', ' yellow', ' brown',
    ' чорна', ' синя', ' біла', ' червона', ' зелена', ' сіра',
    ' золота', ' срібна', ' фіолетова', ' рожева',
    ' чорний', ' синій', ' білий', ' червоний', ' зелений', ' сірий',
    ' помаранчева',
    # Extended color descriptions
    ' синя palm blue', ' сіра warm gray', ' сіра mineral grey', ' сіра charcoal grey',
    ' сіра titan grey', ' сіра titan gray', ' сіра titanium grey', ' сіра titanium gray',
    ' сіра steel gray', ' сіра steel grey', ' сіра graphit grey', ' сіра graphit gray',
    ' сіра graphite grey', ' сіра graphite gray', ' сіра moonshadow grey',
    ' сіра moonshadow gray', ' сіра onyx gray', ' сіра dinamic gray',
    ' біла porcelain white', ' біла creamy white', ' біла glacier white',
    ' біла pearl white', ' біла moon light white', ' біла moonlight white',
    ' біла arctic white', ' біла galaxy white',
    ' зелена emerald green', ' зелена forest green', ' зелена mint green',
    ' зелена clover green', ' зелена sage green', ' зелена aurora green',
    ' зелена meta black',
    ' чорна sarlit black', ' чорна sleek black', ' чорна timber black',
    ' чорна metallic black',
    ' золота pearl gold', ' золота shiny gold',
    ' срібна titan silver',
    ' жовта poco yellow',
    ' помаранчева twilight orange',
]

DISPLAY_SUFFIXES = [
    ' oled', ' tft', ' ips', ' amoled', ' incell', ' p-oled',
]

# Combine all suffixes (longest first to avoid partial matches)
ALL_SUFFIXES = sorted(DISPLAY_SUFFIXES + COLOR_SUFFIXES, key=len, reverse=True)

def strip_suffixes(name):
    """Remove known suffixes from a model code, return the base name."""
    lower = name.lower().strip()
    for sfx in ALL_SUFFIXES:
        if lower.endswith(sfx):
            base = name[:-len(sfx)].strip()
            return base
    return name.strip()

def normalize_whitespace(s):
    return ' '.join(s.split())

# Find all brand sections
brand_pattern = re.compile(r"\n\s+id:\s*'([^']+)',\s*\n\s+name:\s*'([^']+)',")
brand_matches = list(brand_pattern.finditer(content))
brand_info = [(m.start(), m.group(1), m.group(2)) for m in brand_matches]
brand_info.append((len(content), '_end', ''))

total_removed = 0

# Process from last brand to first to preserve line numbers
for bi in range(len(brand_info)-2, -1, -1):
    start = brand_info[bi][0]
    end = brand_info[bi+1][0]
    brand_id = brand_info[bi][1]
    brand_name = brand_info[bi][2]
    
    block = content[start:end]
    
    # Find models array
    models_start = block.find("models: [")
    if models_start == -1:
        continue
    
    # Find closing bracket
    depth = 0
    opened = False
    models_end = -1
    for pos in range(models_start, len(block)):
        ch = block[pos]
        if ch == '[':
            depth += 1
            opened = True
        elif ch == ']':
            depth -= 1
            if opened and depth == 0:
                models_end = pos
                break
    
    if models_end == -1:
        continue
    
    raw_models_block = block[models_start:models_end+1]
    
    # Split into individual model objects
    # Each model object starts with "{\n" or "{\s" at indent level, ends with "},\n  {" or similar
    # Strategy: extract each modelCode,name pair with its position
    model_entries = []
    pattern = re.compile(r"(\s*\{[\s\S]*?modelCode:\s*'([^']+)'[\s\S]*?modelName:\s*'([^']+)'[\s\S]*?\n\s+\},?)")
    
    pos = 0
    for m in re.finditer(r"(\s*\{[\s\S]*?modelCode:\s*'([^']+)'[\s\S]*?modelName:\s*'([^']+)'[\s\S]*?\n\s+\})", raw_models_block):
        full_text = m.group(1)
        code = m.group(2)
        name = m.group(3)
        model_entries.append({
            'start_in_block': m.start(),
            'end_in_block': m.end(),
            'full_text': full_text,
            'code': code,
            'name': name,
            'base_code': strip_suffixes(code).lower(),
        })
    
    if not model_entries:
        # Try single-line format (Apple)
        pattern = re.compile(r"(\{ modelCode:\s*'([^']+)',\s*modelName:\s*'([^']+)',[\s\S]*?\})")
        for m in re.finditer(pattern, raw_models_block):
            full_text = m.group(1)
            code = m.group(2)
            name = m.group(3)
            model_entries.append({
                'start_in_block': m.start(),
                'end_in_block': m.end(),
                'full_text': full_text,
                'code': code,
                'name': name,
                'base_code': strip_suffixes(code).lower(),
            })
    
    if not model_entries:
        continue
    
    # Group by base_code
    groups = {}  # base_code -> list of entries
    order = []   # preserve first-seen order
    for entry in model_entries:
        base = entry['base_code']
        if base not in groups:
            groups[base] = []
            order.append(base)
        groups[base].append(entry)
    
    # For each group: keep one entry, remove the rest
    removed_count = 0
    to_remove = []  # (start_global, end_global) to remove from content
    
    for base in order:
        entries = groups[base]
        if len(entries) <= 1:
            continue
        
        # Find the "best" entry to keep:
        # Prefer one where modelCode == base (no suffix)
        # Otherwise keep the shortest code
        best = None
        for e in entries:
            if e['code'].lower().strip() == base:
                best = e
                break
        if not best:
            # Keep the shortest code
            best = min(entries, key=lambda e: len(e['code']))
        
        # Mark all others for removal
        for e in entries:
            if e is not best:
                to_remove.append((start + models_start + e['start_in_block'],
                                   start + models_start + e['end_in_block']))
                removed_count += 1
                total_removed += 1
    
    if removed_count > 0:
        print(f"  {brand_name}: об'єднано {len(groups)} груп, видалено {removed_count} дублікатів")
        for base in order:
            entries = groups[base]
            if len(entries) > 1:
                keepers = [e['code'] for e in entries if e is not min(entries, key=lambda x: len(x['code']))]
                best_code = min(entries, key=lambda e: len(e['code']))['code']
                print(f"    '{base}' → залишено '{best_code}', видалено: {[e['code'] for e in entries if e['code'] != best_code]}")

# Remove duplicates from content (from end to start to preserve positions)
to_remove.sort(key=lambda x: x[0], reverse=True)
new_content = content
for rs, re in to_remove:
    new_content = new_content[:rs] + new_content[re:]

# Write result
if total_removed > 0:
    # Fix: remove trailing commas before closing brackets, but careful
    open(filepath + '.bak', 'w').write(content)
    open(filepath, 'w').write(new_content)
    print(f"\n✅ Всього видалено {total_removed} дублікатів. Бекап: phone-parts-data.ts.bak")
else:
    print("\n✅ Дублікатів не знайдено, файл не змінено")
