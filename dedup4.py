#!/usr/bin/env python3
"""Final dedup: handle ALL remaining color/display variants by modelName matching and prefix matching."""
import re, os

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
bakpath = filepath + '.bak4'
content = open(filepath).read()

# Comprehensive suffix list
COLOR_SUFFIXES = [
    ' black', ' blue', ' white', ' red', ' green', ' grey', ' gray',
    ' gold', ' silver', ' purple', ' pink', ' orange', ' yellow', ' brown',
    ' navy', ' violet', ' cyan', ' coral', ' mint', ' lime', ' indigo',
    ' чорна', ' синя', ' біла', ' червона', ' зелена', ' сіра',
    ' золота', ' срібна', ' фіолетова', ' рожева', ' бордова', ' жовта',
    ' блакитна', ' коричнева', ' помаранчева',
    ' чорний', ' синій', ' білий', ' червоний', ' зелений', ' сірий',
    ' чорная', ' синяя', ' белая', ' красная', ' зеленая', ' серая',
    # All two-word color names
    ' синя palm blue', ' сіра warm gray', ' сіра mineral grey', 
    ' сіра charcoal grey', ' сіра titanium grey', ' сіра titanium gray',
    ' сіра steel gray', ' сіра steel grey', ' сіра graphite grey',
    ' сіра graphite gray', ' сіра moonshadow grey', ' сіра onyx gray',
    ' сіра dinamic gray', ' сіра titan gray', ' сіра titan grey',
    ' сіра silvery grey',
    ' біла porcelain white', ' біла creamy white', ' біла glacier white',
    ' біла pearl white', ' біла moonlight white', ' біла arctic white',
    ' біла galaxy white', ' біла moon light white',
    ' зелена emerald green', ' зелена forest green', ' зелена mint green',
    ' зелена clover green', ' зелена sage green', ' зелена aurora green',
    ' зелена meta black', ' зелена turquoise cyan',
    ' чорна sarlit black', ' чорна sleek black', ' чорна timber black',
    ' чорна metallic black',
    ' золота pearl gold', ' золота shiny gold', ' срібна titan silver',
    ' жовта poco yellow', ' помаранчева twilight orange',
    # Extended color words that may appear after color names
    ' cloud white', ' state grey', ' state gray', ' carbon grey', ' carbon gray',
    ' racing black', ' night blue', ' navy blue',
    # English with specific names
    ' aurora green', ' emerald green', ' forest green', ' mint green', ' clover green', ' sage green',
    ' pearl white', ' creamy white', ' glacier white', ' pearl gold', ' moon light white',
    ' moonlight white', ' midnight black', ' meteor black', ' timber black',
    ' dark blue', ' ocean blue', ' pearl blue',
]

DISPLAY_SUFFIXES = [
    ' oled', ' tft', ' ips', ' amoled', ' incell', ' p-oled',
    ' oled чорний', ' ips чорний', ' amoled чорний',
    ' amoled', ' incell', ' oled', ' tft', ' ips',
    ' oled black', ' ips black',
]

SCREEN_SIZE = [r' \d+\.\d+"', r' \d+"']

ALL_SUFFIXES = sorted(COLOR_SUFFIXES + DISPLAY_SUFFIXES, key=len, reverse=True)

def strip_all(code):
    """Aggressively strip suffixes."""
    lower = code.lower().strip()
    
    # Strip screen sizes first
    lower = re.sub(r' \d+\.?\d*"', '', lower)
    code_clean = re.sub(r' \d+\.?\d*"', '', code)
    
    # Try each suffix
    for sfx in ALL_SUFFIXES:
        if lower.endswith(sfx):
            new_len = len(code_clean) - len(sfx)
            if new_len > 0:
                return code_clean[:new_len].strip()
    return code_clean.strip()

lines = content.split('\n')

# Find all brands
brand_starts = []
for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*\'([^\']+)\',\s*$', line)
    if m and i+1 < len(lines) and re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1]):
        brand_starts.append((i, m.group(1), re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1]).group(1)))

print(f"Found {len(brand_starts)} brands")

total_removed = 0
removed_by_brand = {}

# Process from last to first
for bi in range(len(brand_starts)-1, -1, -1):
    brand_line, brand_id, brand_name = brand_starts[bi]
    
    # Find models: [
    ms_line = None
    for i in range(brand_line, min(brand_line+15, len(lines))):
        if 'models: [' in lines[i]:
            ms_line = i
            break
    if ms_line is None: continue
    
    # Find closing bracket
    depth = 0
    me_line = -1
    opened = False
    for i in range(ms_line, len(lines)):
        depth += lines[i].count('[') - lines[i].count(']')
        if depth > 0: opened = True
        if opened and depth == 0:
            me_line = i
            break
    if me_line == -1: continue
    
    model_lines = lines[ms_line+1:me_line]
    
    # Parse model entries  
    all_models = []
    current = []
    bd = 0
    in_model = False
    
    for line in model_lines:
        current.append(line)
        bd += line.count('{') - line.count('}')
        if bd > 0: in_model = True
        if in_model and bd == 0:
            full = '\n'.join(current)
            mc = re.search(r"modelCode:\s*'([^']+)'", full)
            mn = re.search(r"modelName:\s*'([^']+)'", full)
            if mc and mn:
                all_models.append({'code': mc.group(1), 'name': mn.group(1)})
            current = []
            in_model = False
            bd = 0
    
    if not all_models:
        continue
    
    # Strategy 1: Group by modelName (same name = same phone)
    by_name = {}
    for idx, m in enumerate(all_models):
        key = m['name'].lower().strip()
        if key not in by_name:
            by_name[key] = []
        by_name[key].append(idx)
    
    name_dupes = [indices for indices in by_name.values() if len(indices) > 1]
    
    # Strategy 2: Group by stripped code
    by_stripped = {}
    for idx, m in enumerate(all_models):
        base = strip_all(m['code']).lower()
        if base not in by_stripped:
            by_stripped[base] = []
        by_stripped[base].append(idx)
    
    stripped_dupes = [indices for indices in by_stripped.values() if len(indices) > 1]
    
    # Combined: mark for removal
    remove_indices = set()
    
    for indices in name_dupes + stripped_dupes:
        if len(indices) <= 1:
            continue
            
        # Find best: prefer exact code match -> stripped base, then shortest
        best_idx = None
        for idx in indices:
            if idx >= len(all_models):
                continue
            m = all_models[idx]
            if m['code'].lower().strip() == m['name'].lower().strip():
                best_idx = idx
                break
        if best_idx is None:
            # Keep the shortest code
            best_idx = min(indices, key=lambda i: len(all_models[i]['code']) if i < len(all_models) else 999)
        
        for idx in indices:
            if idx != best_idx and idx < len(all_models):
                remove_indices.add(idx)
    
    if remove_indices:
        # Rebuild model section
        new_model_lines = []
        current = []
        bd = 0
        in_model = False
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
        
        lines[ms_line+1:me_line] = new_model_lines
        
        count = len(remove_indices)
        total_removed += count
        removed_by_brand[brand_name] = count
        
        # Show what was removed
        for idx in sorted(remove_indices):
            m = all_models[idx]
            print(f"  {brand_name}: removed '{m['code']}' (→ '{m['name']}')")

# Write
if total_removed > 0:
    new_content = '\n'.join(lines)
    open(bakpath, 'w').write(content)
    open(filepath, 'w').write(new_content)
    print(f"\n✅ Total removed: {total_removed}")
else:
    print("\n✅ No more duplicates found")
