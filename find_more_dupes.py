#!/usr/bin/env python3
"""Find models that look like duplicates - same prefix, different suffix."""
import re

filepath = '/Users/aleksandr/Desktop/777111-temp/src/app/phone-parts-data.ts'
content = open(filepath).read()

brand_pattern = re.compile(r"\n\s+id:\s*'([^']+)',\s*\n\s+name:\s*'([^']+)',")
brands = [(m.start(), m.group(1), m.group(2)) for m in brand_pattern.finditer(content)]
brands.append((len(content), '_end', ''))

MORE_SUFFIXES = sorted([
    # English color suffixes
    ' black', ' blue', ' white', ' red', ' green', ' grey', ' gray',
    ' gold', ' silver', ' purple', ' pink', ' orange', ' yellow', ' brown',
    # Ukrainian color suffixes  
    ' чорна', ' синя', ' біла', ' червона', ' зелена', ' сіра',
    ' золота', ' срібна', ' фіолетова', ' рожева', ' бордова',
    ' чорний', ' синій', ' білий', ' червоний', ' зелений', ' сірий',
    ' помаранчева',
    # Ukrainian extended colors
    ' синя palm blue', ' сіра warm gray', ' сіра mineral grey', 
    ' сіра charcoal grey', ' сіра titanium grey', ' сіра titanium gray',
    ' сіра steel gray', ' сіра steel grey', ' сіра graphite grey',
    ' сіра graphite gray', ' сіра moonshadow grey', ' сіра onyx gray',
    ' сіра dinamic gray', ' сіра titan gray', ' сіра titan grey',
    ' сіра silvery grey', ' сіра graphit gray', ' сіра graphit grey',
    ' біла porcelain white', ' біла creamy white', ' біла glacier white',
    ' біла pearl white', ' біла moonlight white', ' біла arctic white',
    ' біла galaxy white', ' біла moon light white',
    ' зелена emerald green', ' зелена forest green', ' зелена mint green',
    ' зелена clover green', ' зелена sage green', ' зелена aurora green',
    ' зелена meta black',
    ' чорна sarlit black', ' чорна sleek black', ' чорна timber black',
    ' чорна metallic black',
    ' золота pearl gold', ' золота shiny gold', ' срібна titan silver',
    ' жовта poco yellow', ' помаранчева twilight orange',
    # Display type suffixes
    ' oled', ' tft', ' ips', ' amoled', ' incell', ' p-oled',
    ' oled чорний', ' ips чорний',
    # Model-specific
    ' 12mp', ' 48mp', ' 64mp', ' 108mp',
], key=len, reverse=True)

def get_base(code):
    lower = code.lower().strip()
    for sfx in MORE_SUFFIXES:
        if lower.endswith(sfx):
            return code[:-len(sfx)].strip()
    return code.strip()

for bi in range(len(brands)-1):
    start, brand_id, brand_name = brands[bi]
    end = brands[bi+1][0]
    block = content[start:end]
    
    ms = block.find('models: [')
    if ms < 0: continue
    
    depth = 0
    opened = False
    me = -1
    for pos in range(ms, len(block)):
        ch = block[pos]
        if ch == '[': depth += 1; opened = True
        elif ch == ']': depth -= 1
        if opened and depth == 0: me = pos; break
    if me < 0: continue
    
    models_text = block[ms:me+1]
    pairs = re.findall(r"modelCode:\s*'([^']+)'.*?modelName:\s*'([^']+)'", models_text)
    
    # Group by base_code (using expanded suffixes)
    groups = {}
    for code, name in pairs:
        base = get_base(code).lower()
        if base not in groups:
            groups[base] = []
        groups[base].append((code, name))
    
    # Show groups with 2+ entries
    multi = {k: v for k, v in groups.items() if len(v) >= 2}
    if multi:
        print(f"\n{brand_name} ({len(pairs)} models):")
        for base, entries in sorted(multi.items()):
            print(f"  BASE: '{base}'")
            for code, name in entries:
                print(f"    · {code:30s} | {name}")
