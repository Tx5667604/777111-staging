#!/usr/bin/env python3
"""
Dedup: process brands from LAST to FIRST to preserve line positions.
"""
import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

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

# Find brands with their line positions
brand_starts = []
for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*\'([^\']+)\',\s*$', line)
    if m and i + 1 < len(lines):
        nm = re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1])
        if nm:
            brand_starts.append((i, m.group(1), nm.group(1)))

print(f"Found {len(brand_starts)} brands")

# Process from LAST to FIRST
total_removed = 0
removed_by_brand = {}

for bi_idx in range(len(brand_starts)-1, -1, -1):
    brand_line, brand_id, brand_name = brand_starts[bi_idx]
    
    # Find models: [ (check original file positions)
    models_start_line = None
    for i in range(brand_line, min(brand_line + 15, len(lines))):
        if 'models: [' in lines[i]:
            models_start_line = i
            break
    
    if models_start_line is None:
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
        continue
    
    model_lines = lines[models_start_line+1:models_end_line]
    
    # Parse model entries with brace counting
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
                all_models.append({'code': mc.group(1), 'name': mn.group(1), 'base': get_base(mc.group(1)).lower()})
            current = []
            in_model = False
            bd = 0
    
    # Group by base
    groups = {}
    group_indices = {}
    for idx, m in enumerate(all_models):
        b = m['base']
        if b not in groups:
            groups[b] = []
            group_indices[b] = []
        groups[b].append(m)
        group_indices[b].append(idx)
    
    # Find which indices to remove
    remove_indices = set()
    for base, entries in groups.items():
        if len(entries) <= 1:
            continue
        
        # Find best entry: code == base (no suffix), then shortest
        best_idx = None
        for idx in group_indices[base]:
            if all_models[idx]['code'].lower().strip() == base:
                best_idx = idx
                break
        if best_idx is None:
            best_code = min(entries, key=lambda e: len(e['code']))['code']
            for idx in group_indices[base]:
                if all_models[idx]['code'] == best_code:
                    best_idx = idx
                    break
        
        for idx in group_indices[base]:
            if idx != best_idx:
                remove_indices.add(idx)
    
    if remove_indices:
        # Rebuild model section, skipping removed entries
        new_model_lines = []
        current = []
        in_model = False
        bd = 0
        model_idx = 0
        
        for line in model_lines:
            current.append(line)
            bd += line.count('{') - line.count('}')
            if bd > 0: in_model = True
            if in_model and bd == 0:
                if model_idx not in remove_indices:
                    new_model_lines.extend(current)
                current = []
                in_model = False
                bd = 0
                model_idx += 1
        
        # Replace in lines list
        lines[models_start_line+1:models_end_line] = new_model_lines
        
        count = len(remove_indices)
        total_removed += count
        removed_by_brand[brand_name] = count
        print(f"  {brand_name}: removed {count} duplicates (now {len(all_models)-count} models)")

# Write result
if total_removed > 0:
    new_content = '\n'.join(lines)
    # backup
    open(filepath + '.bak3', 'w').write(content)
    open(filepath, 'w').write(new_content)
    print(f"\n✅ TOTAL: removed {total_removed} duplicates")
else:
    print("\n✅ No duplicates found")
