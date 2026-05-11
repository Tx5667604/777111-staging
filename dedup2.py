#!/usr/bin/env python3
"""
Fix: the script processes phone-parts-data.ts line-by-line within each brand block.
More robust approach.
"""

import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Suffixes to identify non-base entries
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

DISPLAY_SUFFIXES = [
    ' oled', ' tft', ' ips', ' amoled', ' incell', ' p-oled',
    ' oled чорний', ' ips чорний',
]

ALL_SUFFIXES = sorted(DISPLAY_SUFFIXES + COLOR_SUFFIXES, key=len, reverse=True)

def get_base(code):
    """Remove known suffixes from a model code."""
    lower = code.lower().strip()
    for sfx in ALL_SUFFIXES:
        if lower.endswith(sfx):
            return code[:-len(sfx)].strip()
    return code.strip()

# Find brand boundaries: each brand has `id: 'xxx', name: 'Xxx',` then `models: [...]`
# Strategy: split the file into lines and find brand blocks
lines = content.split('\n')

# Find brand start and model block boundaries
brand_starts = []
for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*\'([^\']+)\',\s*$', line)
    if m:
        brand_id = m.group(1)
        # Next line should have name
        if i + 1 < len(lines):
            nm = re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1])
            if nm:
                brand_starts.append((i, brand_id, nm.group(1)))

print(f"Found {len(brand_starts)} brands")

# Process brand by brand
total_removed = 0
stats = {}

for bi_idx in range(len(brand_starts)):
    brand_line, brand_id, brand_name = brand_starts[bi_idx]
    
    # Find the models: [ line
    models_start_line = None
    for i in range(brand_line, min(brand_line + 10, len(lines))):
        if 'models: [' in lines[i] or 'models:[' in lines[i]:
            models_start_line = i
            break
    
    if models_start_line is None:
        continue
    
    # Find the closing ] of the models array
    # Count brackets from models_start_line
    depth = 0
    models_end_line = -1
    opened = False
    for i in range(models_start_line, len(lines)):
        bracket_count = lines[i].count('[') - lines[i].count(']')
        depth += bracket_count
        if bracket_count > 0:
            opened = True
        if opened and depth == 0:
            models_end_line = i
            break
    
    if models_end_line == -1:
        continue
    
    # Extract model lines (from models_start_line+1 to models_end_line-1)
    model_lines = lines[models_start_line+1:models_end_line]
    
    # Group: find each modelCode + modelName pair and determine base
    # A model entry spans from one "{" to the next "}" at indent level
    all_models = []
    current = []
    in_model = False
    brace_depth = 0
    
    for line in model_lines:
        current.append(line)
        brace_depth += line.count('{') - line.count('}')
        if brace_depth > 0:
            in_model = True
        if in_model and brace_depth == 0:
            # End of one model entry
            full = '\n'.join(current)
            # Extract modelCode and modelName
            mc = re.search(r"modelCode:\s*'([^']+)'", full)
            mn = re.search(r"modelName:\s*'([^']+)'", full)
            if mc and mn:
                all_models.append({
                    'full': full,
                    'code': mc.group(1),
                    'name': mn.group(1),
                    'base_code': get_base(mc.group(1)).lower(),
                })
            current = []
            in_model = False
    
    # Group by base_code
    groups = {}
    order = []
    group_indices = {}  # base -> list of indices in all_models
    
    for idx, m in enumerate(all_models):
        base = m['base_code']
        if base not in groups:
            groups[base] = []
            order.append(base)
            group_indices[base] = []
        groups[base].append(m)
        group_indices[base].append(idx)
    
    # Find duplicates
    removed_indices = set()
    for base in order:
        entries = groups[base]
        if len(entries) <= 1:
            continue
        
        # Find best entry to keep
        # Prefer: exact match (code == base_name), then shortest code
        base_name_orig = entries[0]['base_code']
        
        best_idx = None
        for idx in group_indices[base]:
            m = all_models[idx]
            if m['code'].lower().strip() == base_name_orig:
                best_idx = idx
                break
        
        if best_idx is None:
            # Keep shortest
            shortest = min(entries, key=lambda e: len(e['code']))
            for idx in group_indices[base]:
                if all_models[idx] is shortest:
                    best_idx = idx
                    break
        
        # Mark others for removal
        for idx in group_indices[base]:
            if idx != best_idx:
                removed_indices.add(idx)
    
    if removed_indices:
        # Build new model_lines without removed entries
        new_model_lines = []
        current = []
        in_model = False
        brace_depth = 0
        model_idx = 0
        skipped = 0
        
        for line in model_lines:
            current.append(line)
            brace_depth += line.count('{') - line.count('}')
            if brace_depth > 0:
                in_model = True
            if in_model and brace_depth == 0:
                if model_idx in removed_indices:
                    skipped += 1
                    total_removed += 1
                else:
                    new_model_lines.extend(current)
                current = []
                in_model = False
                model_idx += 1
        
        # Replace the model section
        lines[models_start_line+1:models_end_line] = new_model_lines
        
        stats[brand_name] = {
            'total': len(all_models),
            'removed': skipped,
            'groups': len(groups),
        }

# Write result
if total_removed > 0:
    new_content = '\n'.join(lines)
    open(filepath + '.bak2', 'w').write(content)
    open(filepath, 'w').write(new_content)
    
    print(f"\n✅ Всього видалено {total_removed} дублікатів")
    for brand, s in sorted(stats.items(), key=lambda x: x[1]['removed'], reverse=True):
        if s['removed'] > 0:
            print(f"  {brand}: {s['total']} → {s['total']-s['removed']} моделей (-{s['removed']})")
else:
    print("\n✅ Дублікатів не знайдено")
