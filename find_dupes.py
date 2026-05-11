import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

# Find all brand sections
brand_pattern = r"\{\s*\n\s+id:\s*'([^']+)',\s*\n\s+name:\s*'([^']+)',"

brand_info = []
for m in re.finditer(brand_pattern, content):
    brand_info.append((m.start(), m.group(1), m.group(2)))

brand_info.append((len(content), '_end', ''))

print(f"Found {len(brand_info)-1} brands")

# For each brand, find models: [...]
# Strategy: from the id/name block start, find 'models: [' then find corresponding closing ']'
for i in range(len(brand_info)-1):
    start = brand_info[i][0]
    end = brand_info[i+1][0]
    block = content[start:end]
    brand_id = brand_info[i][1]
    brand_name = brand_info[i][2]
    
    # Find models array start
    models_start = block.find("models: [")
    if models_start == -1:
        models_start = block.find("models:[")
    if models_start == -1:
        continue
    
    # Find the closing bracket of the models array
    # Count brackets from models_start
    bracket_count = 0
    bracket_opened = False
    models_end = -1
    for pos in range(models_start, len(block)):
        ch = block[pos]
        if ch == '[':
            bracket_count += 1
            bracket_opened = True
        elif ch == ']':
            bracket_count -= 1
            if bracket_opened and bracket_count == 0:
                models_end = pos
                break
    
    if models_end == -1:
        print(f"  {brand_name}: could not find models array end")
        continue
    
    models_text = block[models_start:models_end+1]
    
    # Extract all modelCode values - handle both single-line and multi-line
    codes = re.findall(r"modelCode:\s*'([^']+)'", models_text)
    
    # Find duplicates
    seen = {}
    duplicates = []
    unique_codes = []
    for code in codes:
        key = code.lower().strip()
        if key in seen:
            duplicates.append(code)
        else:
            seen[key] = code
            unique_codes.append(code)
    
    if duplicates:
        print(f"\n⚠️ {brand_name} ({brand_id}): {len(codes)} total, {len(duplicates)} DUPLICATES")
        for dup in duplicates:
            print(f"  ✗ '{dup}' (also appears as '{seen[dup.lower().strip()]}')")
    else:
        print(f"✅ {brand_name} ({brand_id}): {len(unique_codes)} models — clean")
