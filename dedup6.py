#!/usr/bin/env python3
"""Remove last 8 duplicate groups by directly removing duplicate entries."""
import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Find all model entries with their positions (start/end in file)
# Strategy: find each modelCode + modelName + parts block

# Find brands
brand_starts = [(m.start(), m.group(1), m.group(2)) for m in 
    re.finditer(r"\n\s+id:\s*'([^']+)',\s*\n\s+name:\s*'([^']+)',", content)]
brand_starts.append((len(content), '_end', '_end'))

print(f"Brands: {len(brand_starts)-1}")

# Read lines
lines = content.split('\n')

# Process each brand
total_removed = 0

for bi in range(len(brand_starts)-2, -1, -1):
    brand_line = brand_starts[bi][0]
    brand_name = brand_starts[bi][2]
    
    # Count line number from position
    line_num = content[:brand_line].count('\n')
    
    # Find start of models array
    ms = None
    for i in range(line_num, min(line_num+20, len(lines))):
        if 'models: [' in lines[i]:
            ms = i
            break
    if ms is None:
        continue
    
    # Find end
    depth = 0
    me = None
    for i in range(ms, len(lines)):
        depth += lines[i].count('[') - lines[i].count(']')
        if depth == 0 and i > ms:
            me = i
            break
    if me is None:
        continue
    
    # Build model entries list
    model_lines = lines[ms+1:me]
    entries = []
    current = []
    bd = 0
    for line in model_lines:
        current.append(line)
        bd += line.count('{') - line.count('}')
        if bd == 0 and current and any('modelCode:' in l for l in current):
            full = '\n'.join(current)
            mc = re.search(r"modelCode:\s*'([^']+)'", full)
            mn = re.search(r"modelName:\s*'([^']+)'", full)
            if mc and mn:
                entries.append({'lines': list(current), 'code': mc.group(1), 'name': mn.group(1)})
            current = []
        elif bd == 0:
            current = []
    
    # Group by name
    by_name = {}
    for idx, e in enumerate(entries):
        key = e['name'].lower().strip()
        by_name.setdefault(key, []).append(idx)
    
    # Find duplicates
    to_remove = []
    for key, indices in by_name.items():
        if len(indices) <= 1:
            continue
        # Keep best (shortest code)
        best = min(indices, key=lambda i: len(entries[i]['code']))
        for idx in indices:
            if idx != best:
                to_remove.append(idx)
    
    if to_remove:
        # Rebuild model lines
        new_lines = []
        e_idx = 0
        cur = []
        bd = 0
        for line in model_lines:
            cur.append(line)
            bd += line.count('{') - line.count('}')
            if bd == 0 and cur and any('modelCode:' in l for l in cur):
                if e_idx not in to_remove:
                    new_lines.extend(cur)
                else:
                    e = entries[e_idx] if e_idx < len(entries) else {'code': '?', 'name': '?'}
                    print(f"  {brand_name}: removing '{e['code']}' (name: '{e['name']}')")
                cur = []
                bd = 0
                e_idx += 1
            elif bd == 0:
                cur = []
        
        lines[ms+1:me] = new_lines
        total_removed += len(to_remove)

if total_removed:
    new_content = '\n'.join(lines)
    open(filepath + '.bak6', 'w').write(content)
    open(filepath, 'w').write(new_content)
    print(f"\n✅ Removed {total_removed} duplicates")
else:
    print("\n✅ No duplicates found")
