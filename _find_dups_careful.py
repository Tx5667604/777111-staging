import re
from collections import defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Split into brand sections
# Each brand starts with:     id: 'brand_name'
brand_sections = {}
for m in re.finditer(r"\n    id: '([^']+)'\n    name: '([^']+)'\n    logo: '[^']+'\n    models: \[", content):
    brand_id = m.group(1)
    brand_name = m.group(2)
    start = m.end()
    
    # Find next brand or end
    rest = content[start:]
    next_brand = re.search(r"\n  \},\n  \{\n    id: '", rest)
    if next_brand:
        end = start + next_brand.start()
    else:
        end = content.rfind(']') + 1
    
    brand_sections[brand_id] = {
        'name': brand_name,
        'start': start,
        'end': end,
        'text': content[start:end]
    }

# For each brand, analyze models
all_to_remove = []  # list of (modelName, reason)

for brand_id, info in sorted(brand_sections.items()):
    text = info['text']
    codes = re.findall(r"modelCode: '([^']+)'", text)
    names = re.findall(r"modelName: '([^']+)'", text)
    
    if not codes:
        continue
    
    # Group models by base name (removing common suffixes)
    base_to_variants = defaultdict(list)
    for code, name in zip(codes, names):
        # Determine the "base" name by removing color/year/OLED/connectivity suffixes
        base = name
        # Remove these specific suffixes (they make variants, not different models)
        suffixes = []
        
        # Year suffixes
        if re.search(r'\s(201[0-9]|202[0-9])$', base):
            year = re.search(r'\s(201[0-9]|202[0-9])$', base).group(1)
            suffixes.append(('year', year))
            base = re.sub(r'\s' + year + '$', '', base)
        
        # Color suffixes (Ukrainian/Russian/English)
        color_patterns = [
            r'\s+(?:чорна|чёрная|синя|синяя|червона|красная|бронзова|бронзовая|фіолетова|фиолетовая|зелена|зеленая|сіра|серый|золота|золотая|біла|белая)',
            r'\s+\w+\s+(?:Red|Blue|Black|White|Gold|Silver|Purple|Pink|Green|Gray|Teal)$',
            r'\s+(?:Atlantic|Graphite|Polar|Ocean|Titanium|Misty|Sunset|Mineral|Meteorite|Nebula|Fresh|Orchid|Viva|Sleek)\s+\w+',
            r'\s+(?:Sleek|Fresh)\s+\w+',
            r'\s+Metal(?:\s+\w+)?$',
            r'\s+Viva\s+\w+',
        ]
        for pat in color_patterns:
            m = re.search(pat, base)
            if m:
                base = base[:m.start()]
        
        # OLED/AMOLED/TFT suffix
        base = re.sub(r'\s+(?:OLED|AMOLED|P-OLED|TFT|INCELL)\s*', ' ', base)
        
        # Camera MP suffix (e.g., "12MP", "24MP")
        base = re.sub(r'\s+\d+MP', '', base)
        
        # Connectivity duplicates (4G/5G when same model)
        # Don't remove if it changes model identity (A54 4G vs A54 5G are different)
        
        # Region suffix
        base = re.sub(r'\s+Global(?:\s+\w+)?$', '', base)
        base = re.sub(r'\s+European$', '', base)
        base = re.sub(r'\s+на\s+\d+\s+Sim$', '', base)
        
        # Size suffix like "168мм"
        base = re.sub(r'\s+\d+мм$', '', base)
        
        base = re.sub(r'\s+', ' ', base).strip()
        
        base_to_variants[base].append((code, name))
    
    # Find groups where we have multiple entries that should be deduplicated
    for base, variants in base_to_variants.items():
        if len(variants) < 2:
            continue
        
        # Find which variant is the "base" (shortest name, no color/suffix)
        # The base should be the one without color/year/OLED descriptors
        def has_extra(name):
            extras = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025',
                     'Oled', 'OLED', 'AMOLED', 'P-OLED', 'TFT', 'INCELL',
                     'чорна', 'чёрная', 'синя', 'синяя', 'червона', 'красная',
                     'бронзова', 'фіолетова', 'сіра', 'чорний', 'чёрный',
                     'Blue', 'Red', 'Gold', 'Black', 'White', 'Purple', 'Pink',
                     'Atlantic', 'Graphite', 'Polar', 'Titanium', 'Ocean', 'Teal',
                     'Misty', 'Sunset', 'Mineral', 'Meteorite', 'Nebula', 'Fresh',
                     'Orchid', 'Viva', 'Sleek', 'Metal', '24MP', '48MP', '12MP',
                     'Dual Sim', 'LTE', 'Global', 'European']
            for e in extras:
                if e in name:
                    return True
            return False
        
        # Sort: models without extras first
        no_extra = [v for v in variants if not has_extra(v[0])]
        with_extra = [v for v in variants if has_extra(v[0])]
        
        if no_extra and with_extra:
            # Keep the base, remove the extras
            for code, name in with_extra:
                # But verify: don't remove 5G variants if the base is 4G (different model)
                # Check if removing would lose info
                has_5g = '5G' in code
                base_has_5g = any('5G' in v[0] for v in no_extra)
                
                if has_5g and not base_has_5g:
                    continue  # This is a 5G variant, base is only 4G - different model
                
                # Check that what we're keeping actually exists as a unique model
                all_to_remove.append((brand_id, code, name))

print("=== Models to remove (color/year/screen variants where base exists) ===")
current_brand = ""
for brand_id, code, name in sorted(all_to_remove, key=lambda x: (x[0], x[1])):
    if brand_id != current_brand:
        print(f"\n--- {brand_id.upper()} ---")
        current_brand = brand_id
    print(f"  {code}  ({name})")
