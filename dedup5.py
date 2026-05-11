#!/usr/bin/env python3
"""Final de-dup: brute force remove ALL same-brand same-name entries."""
import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

lines = content.split('\n')

# Find brands
brand_starts = []
for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*\'([^\']+)\',\s*$', line)
    if m and i+1 < len(lines):
        nm = re.match(r'\s+name:\s*\'([^\']+)\',', lines[i+1])
        if nm:
            brand_starts.append((i, m.group(1), nm.group(1)))

print(f"Brands: {len(brand_starts)}")

total_removed = 0

# Process last to first
for bi in range(len(brand_starts)-1, -1, -1):
    brand_line, brand_id, brand_name = brand_starts[bi]
    
    # Find models: [ line
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
    entries = []
    current = []
    bd = 0
    for line in model_lines:
        current.append(line)
        bd += line.count('{') - line.count('}')
        if bd > 0 and not [l for l in current if 'modelCode:' in l]:
            pass
        if bd == 0 and any('modelCode:' in l for l in current):
            full = '\n'.join(current)
            mc = re.search(r"modelCode:\s*'([^']+)'", full)
            mn = re.search(r"modelName:\s*'([^']+)'", full)
            if mc and mn:
                entries.append({'text': full, 'code': mc.group(1), 'name': mn.group(1)})
            current = []
        elif bd == 0:
            current = []
    
    # Group by modelName (case-insensitive)
    by_name = {}
    for idx, e in enumerate(entries):
        key = e['name'].lower().strip()
        by_name.setdefault(key, []).append(idx)
    
    # Find duplicates
    to_remove = []
    for key, indices in by_name.items():
        if len(indices) <= 1: continue
        
        # Find best entry to keep (shortest code, then exact name match)
        best_idx = indices[0]
        for idx in indices:
            e = entries[idx]
            # Prefer: code == name (base entry)
            if e['code'].lower().strip() == key:
                best_idx = idx
                break
        
        # If no base match, keep shortest code
        if best_idx == indices[0]:
            candidates = sorted(indices, key=lambda i: len(entries[i]['code']))
            best_idx = candidates[0]
        
        for idx in indices:
            if idx != best_idx:
                to_remove.append(idx)
    
    if to_remove:
        # Build model lines without removed entries
        new_model_lines = []
        current = []
        bd = 0
        e_idx = 0
        for line in model_lines:
            current.append(line)
            bd += line.count('{') - line.count('}')
            if bd == 0 and any('modelCode:' in l for l in current):
                if e_idx not in to_remove:
                    new_model_lines.extend(current)
                else:
                    e = entries[e_idx] if e_idx < len(entries) else {'code': '?', 'name': '?'}
                current = []
                bd = 0
                e_idx += 1
            elif bd == 0:
                current = []
        
        removed = len(to_remove)
        total_removed += removed
        lines[ms_line+1:me_line] = new_model_lines
        
        for idx in sorted(to_remove):
            e = entries[idx]
            print(f"  {brand_name}: removed '{e['code']}' (name: '{e['name']}')")

if total_removed:
    new_content = '\n'.join(lines)
    open(filepath + '.bak5', 'w').write(content)
    open(filepath, 'w').write(new_content)
    print(f"\n✅ Removed {total_removed} duplicates total")
else:
    print("\n✅ No duplicates found")
