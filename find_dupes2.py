import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Find brand start positions by looking for "id: 'X', name: 'Y'" pattern
brand_pattern = re.compile(r"\n\s+id:\s*'([^']+)',\s*\n\s+name:\s*'([^']+)',")
brand_info = []
for m in brand_pattern.finditer(content):
    brand_info.append((m.start(), m.group(1), m.group(2)))
brand_info.append((len(content), '_end', ''))

print(f"Found {len(brand_info)-1} brands")

# For each brand, extract models
for i in range(len(brand_info)-1):
    start = brand_info[i][0]
    end = brand_info[i+1][0]
    block = content[start:end]
    brand_id = brand_info[i][1]
    brand_name = brand_info[i][2]
    
    # Find models array
    models_start = block.find("models: [")
    if models_start == -1:
        models_start = block.find("models:[")
    if models_start == -1:
        continue
    
    # Count brackets to find closing
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
    
    models_text = block[models_start:models_end+1]
    
    # Extract modelCode,modelName pairs
    # Multi-line: modelCode on one line, modelName on next
    pairs = re.findall(r"modelCode:\s*'([^']+)'[^}]*?modelName:\s*'([^']+)'", models_text)
    
    # Deduplicate by modelCode (some might appear multiple times)
    seen_codes = {}
    unique_pairs = []
    for code, name in pairs:
        key = code.lower().strip()
        if key not in seen_codes:
            seen_codes[key] = True
            unique_pairs.append((code, name))
    
    # Check 1: same modelName, different modelCode (e.g. "A17" and "A17 Blue" both named "A17")
    by_name = {}
    for idx, (code, name) in enumerate(unique_pairs):
        nl = name.lower().strip()
        if nl not in by_name:
            by_name[nl] = []
        by_name[nl].append((code, name, idx))
    
    name_issues = [(n, entries) for n, entries in by_name.items() if len(entries) > 1]
    
    # Check 2: modelCode has color suffix and base model exists
    color_suffixes = [
        ' black', ' blue', ' white', ' red', ' green', ' grey', ' gray',
        ' gold', ' silver', ' purple', ' pink', ' orange', 'yellow', 'brown',
        ' чорна', ' синя', ' біла', ' червона', ' зелена', ' сіра',
        ' золота', ' срібна', ' фіолетова', ' рожева',
        ' чорний', ' синій', ' білий', ' червоний', ' зелений', ' сірий',
    ]
    
    color_issues = []
    codes_list = [c for c, n in unique_pairs]
    for c1 in codes_list:
        c1l = c1.lower().strip()
        for sfx in color_suffixes:
            if c1l.endswith(sfx):
                base = c1l[:-len(sfx)].strip()
                if base in [c.lower().strip() for c in codes_list]:
                    color_issues.append((c1, base))
                break
    
    # Check 3: near-duplicate codes (one is prefix of another + extra chars)
    near_dupes = []
    for c1 in codes_list:
        c1l = c1.lower().strip()
        for c2 in codes_list:
            c2l = c2.lower().strip()
            if c1l != c2l and len(c1l) >= 3 and len(c2l) >= 3:
                # Check if c1 is a prefix of c2 with only extra year/version suffix
                if c2l.startswith(c1l) and len(c2l) > len(c1l) + 2:
                    after = c2l[len(c1l):].strip()
                    if after in (' 2020', ' 2021', ' 2022', ' 2023', ' 2024', ' 2025',
                                 ' pro', ' lte', ' 5g', ' plus', ' mini', ' max', ' se',
                                 ' 2020 edition', ' 2021 edition',
                                 ' dual sim', ' ds', ' dual', ' nfc'):
                        near_dupes.append((c2, c1))
    
    all_issues = name_issues or color_issues or near_dupes
    if all_issues:
        print(f"\n⚠️ {brand_name} ({brand_id}): {len(unique_pairs)} уникальних моделей")
        
        if name_issues:
            print(f"   ❌ Однакові назви ({len(name_issues)}):")
            for name, entries in name_issues:
                print(f"      Назва '{entries[0][1]}' — кілька записів:")
                for code, _, _ in entries:
                    print(f"        → '{code}'")
        
        if color_issues:
            print(f"   🎨 Кольорові варіанти ({len(color_issues)}):")
            for variant, base in color_issues:
                print(f"      '{variant}' → має бути '{base}'")
        
        if near_dupes:
            print(f"   📅 Річні/версійні варіанти ({len(near_dupes)}):")
            for variant, base in near_dupes:
                print(f"      '{variant}' → майже '{base}'")

# Global stats
print("\n\n========= СТАТИСТИКА =========")
total = 0
for i in range(len(brand_info)-1):
    start = brand_info[i][0]
    end = brand_info[i+1][0]
    block = content[start:end]
    brand_id = brand_info[i][1]
    brand_name = brand_info[i][2]
    
    models_start = block.find("models: [")
    if models_start == -1:
        continue
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
    models_text = block[models_start:models_end+1]
    cnt = models_text.count("modelCode:")
    total += cnt
    print(f"  {brand_name}: {cnt}")

print(f"\n  Всього: {total}")
