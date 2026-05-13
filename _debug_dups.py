import re

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Xiaomi section
start = content.find("\n    id: 'xiaomi'\n    name: 'Xiaomi'")
models_start = content.find('models: [', start)
section_end = content.find('\n    ]\n  },\n  {\n    id: ', start)

text = content[models_start:section_end]
codes = re.findall(r"modelCode: '([^']+)'", text)

# Check: does "Poco M4 Pro" exist without color?
base_models = set()
for c in codes:
    has_color = any(w in c.lower() for w in ['чёрная', 'чорна', 'червона', 'червон', 'фіолет',
                                               'бронзов', 'атлантик', 'синя', 'синяя',
                                               'blue', 'black', 'white', 'gold', 'red', 'purple',
                                               'atlantic', 'graphite', 'polar', 'titanium',
                                               'ocean', 'teal', 'misty', 'sunset', 'metal',
                                               'meteorite', 'mineral', 'magenta', 'nebula',
                                               'orchid', 'sleek', 'fresh', 'viva',
                                               'green', 'gray', 'grey', 'pink'])
    
    # Get base name (remove color suffixes)
    base = c.lower()
    # Remove common color patterns
    base = re.sub(r'\s+чёрная|\s+чорна|\s+червона|\s+синя|\s+синяя|\s+фіолетова', '', base)
    base = re.sub(r'\s+красная|\s+бронзова|\s+бронзовая', '', base)
    base = re.sub(r'\s+сіра|\s+серый', '', base)
    base = re.sub(r'\s+золота|\s+золотая|\s+біла|\s+белая|\s+зелена|\s+зеленая', '', base)
    base = re.sub(r'\s+(Atlantic|Graphite|Polar)\s+\w+', '', base, flags=re.IGNORECASE)
    base = re.sub(r'\s+(Titanium|Ocean|Teal|Misty|Sunset|Metal)\s*\w*', '', base, flags=re.IGNORECASE)
    base = re.sub(r'\s+(Mineral|Meteorite|Nebula|Orchid|Viva|Sleek|Fresh)\s+\w+', '', base, flags=re.IGNORECASE)
    base = re.sub(r'\s+(Red|Blue|Black|White|Gold|Silver|Purple|Pink|Green|Gray|Grey)\s*\w*$', '', base, flags=re.IGNORECASE)
    base = re.sub(r'\s+OLED|\s+AMOLED|\s+P-OLED|\s+TFT|\s+INCELL', '', base)
    base = re.sub(r'\s+\d+MP', '', base)
    base = re.sub(r'\s+', ' ', base).strip()
    
    if has_color:
        # Check if base exists
        found = False
        for c2 in codes:
            if c2.lower().strip() == base:
                print(f'FOUND BASE: "{c}" -> base is "{c2}"')
                found = True
                break
        if not found:
            # Check if there's a near match
            for c2 in codes:
                if c2.lower().startswith(base) and c2 != c:
                    print(f'NEAR BASE: "{c}" -> near base "{c2}"')
                    found = True
                    break
        if not found:
            print(f'NO BASE: "{c}" (normalized: "{base}")')

# Check specific cases
print("\n\n=== SPECIFIC CHECKS ===")
checks = [
    "Poco M4 Pro 4G чёрная",
    "Poco M4 Pro 5G чёрная",
    "Redmi Note 8 Pro сине-фіолетова",
    "Redmi Note 8 Pro",
]
for c in checks:
    exists = c in codes
    print(f'  {c}: {"EXISTS" if exists else "NOT FOUND"}')
