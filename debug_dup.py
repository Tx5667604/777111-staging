#!/usr/bin/env python3
"""
Debug version - check each brand.
"""
import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Suffixes
COLOR_SUFFIXES = [
    ' black', ' blue', ' white', ' red', ' green', ' grey', ' gray',
    ' gold', ' silver', ' purple', ' pink', ' orange', ' yellow', ' brown',
    ' чорна', ' синя', ' біла', ' червона', ' зелена', ' сіра',
    ' золота', ' срібна', ' фіолетова', ' рожева',
    ' чорний', ' синій', ' білий', ' червоний', ' зелений', ' сірий',
    ' помаранчева',
    ' синя palm blue', ' сіра warm gray', ' сіра mineral grey', ' сіра charcoal grey',
    ' сіра titan grey', ' сіра titan gray', ' сіра titanium grey', ' сіра titanium gray',
    ' сіра steel gray', ' сіра steel grey', ' сіра graphite grey', ' сіра graphite gray',
    ' сіра graphit grey', ' сіра graphit gray', ' сіра moonshadow grey', ' сіра onyx gray',
    ' сіра dinamic gray',
    ' біла porcelain white', ' біла creamy white', ' біла glacier white',
    ' біла pearl white', ' біла moonlight white', ' біла moon light white',
    ' біла arctic white', ' біла galaxy white',
    ' зелена emerald green', ' зелена forest green', ' зелена mint green',
    ' зелена clover green', ' зелена sage green', ' зелена aurora green',
    ' чорна sarlit black', ' чорна sleek black', ' чорна timber black',
    ' чорна metallic black',
    ' золота pearl gold', ' золота shiny gold', ' срібна titan silver',
    ' жовта poco yellow', ' помаранчева twilight orange', ' зелена meta black',
]

DISPLAY_SUFFIXES = [' oled', ' tft', ' ips', ' amoled', ' incell', ' p-oled', ' oled чорний', ' ips чорний']
ALL_SUFFIXES = sorted(DISPLAY_SUFFIXES + COLOR_SUFFIXES, key=len, reverse=True)

def get_base(code):
    lower = code.lower().strip()
    for sfx in ALL_SUFFIXES:
        if lower.endswith(sfx):
            return code[:-len(sfx)].strip()
    return code.strip()

lines = content.split('\n')

# Find brands
brand_starts = []
for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*\'([^\']+)\',\s*$', line)
    if m:
        if i + 1 < len(lines):
            nm = re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1])
            if nm:
                brand_starts.append((i, m.group(1), nm.group(1)))

for bi in range(min(10, len(brand_starts))):
    brand_line, brand_id, brand_name = brand_starts[bi]
    
    # Find models: [
    models_start_line = None
    for i in range(brand_line, min(brand_line + 15, len(lines))):
        if 'models: [' in lines[i]:
            models_start_line = i
            break
    
    if models_start_line is None:
        print(f"{brand_name}: NO models: [ found")
        continue
    
    # Find closing bracket
    depth = 0
    models_end_line = -1
    opened = False
    for i in range(models_start_line, len(lines)):
        depth += lines[i].count('[') - lines[i].count(']')
        if depth > 0: opened = True
        if opened and depth == 0:
            models_end_line = i
            break
    
    if models_end_line == -1:
        print(f"{brand_name}: no closing bracket")
        continue
    
    model_lines = lines[models_start_line+1:models_end_line]
    
    # Parse model entries
    all_models = []
    current = []
    in_model = False
    bd = 0
    for line in model_lines:
        current.append(line)
        bd += line.count('{') - line.count('}')
        if bd > 0: in_model = True
        if in_model and bd == 0:
            full = '\n'.join(current)
            mc = re.search(r"modelCode:\s*'([^']+)'", full)
            mn = re.search(r"modelName:\s*'([^']+)'", full)
            if mc and mn:
                all_models.append({
                    'code': mc.group(1),
                    'name': mn.group(1),
                    'base': get_base(mc.group(1)).lower(),
                })
            elif mc:
                print(f"  {brand_name}: modelCode '{mc.group(1)}' has no modelName!")
            current = []
            in_model = False
            bd = 0
    
    # Group
    groups = {}
    for m in all_models:
        b = m['base']
        if b not in groups: groups[b] = []
        groups[b].append(m['code'])
    
    dup_count = sum(1 for g in groups.values() if len(g) > 1)
    if dup_count > 0:
        print(f"\n{brand_name}: {len(all_models)} parsed, {dup_count} duplicate groups")
        for b, codes in sorted(groups.items()):
            if len(codes) > 1:
                print(f"  '{b}': {codes}")
    else:
        print(f"{brand_name}: {len(all_models)} parsed, no duplicates")
