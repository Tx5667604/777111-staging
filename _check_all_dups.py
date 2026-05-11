import re
from collections import defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

all_models = {}
for m in re.finditer(r"modelCode: '([^']+)'.*?modelName: '([^']+)'", content):
    code, name = m.group(1), m.group(2)
    all_models[code] = name

# Find brands and their model counts
brand_starts = {}
for m in re.finditer(r"\n    id: '([^']+)'\n    name: '([^']+)'", content):
    brand_id = m.group(1)
    brand_name = m.group(2)
    
    start = m.end()
    end_match = re.search(r"\n    ]\n  \{\n    id: '", content[start:])
    if end_match:
        end = start + end_match.start()
    else:
        end = len(content)
    
    # Extract modelCodes and modelNames
    section = content[start:end]
    codes = re.findall(r"modelCode: '([^']+)'", section)
    names = re.findall(r"modelName: '([^']+)'", section)
    
    print(f"\n=== {brand_name} ===")
    print(f"  Models: {len(codes)}")
    
    # Exact duplicates
    from collections import Counter
    dup_counts = Counter(codes)
    exact = [(k, v) for k, v in dup_counts.items() if v > 1]
    if exact:
        print(f"  Exact duplicates: {len(exact)}")
        for k, v in sorted(exact):
            print(f"    \"{k}\" x{v}")
    
    # Near-duplicates (color/year variant)
    normalized = defaultdict(list)
    for c in codes:
        n = c.lower()
        for word in ['oled', 'dual sim', 'lte', '24mp', '48mp', 'wifi', '5g', '4g',
                     'чорна', 'синя', 'червона', 'бронзова', 'сине', 'фіолетова',
                     'чёрная', 'синяя', 'красная', 'бронзовая', 'фиолетовая',
                     'metal', 'atlantic', 'graphite', 'polar', 'ocean', 'teal',
                     'titanium', 'cool', 'sunset', 'red', 'global', 'european',
                     'china', 'poco', 'power', 'version', 'на']:
            n = n.replace(word, '')
        n = re.sub(r'[a-z0-9]+-[a-z0-9]+\s*', '', n)
        n = re.sub(r'\d+x\d+', '', n)
        n = re.sub(r'\d{3,4}мм', '', n)
        n = re.sub(r'\s+', ' ', n).strip().strip('-').strip()
        if n:
            normalized[n].append(c)
    
    near = {k: v for k, v in normalized.items() if len(v) > 1}
    if near:
        # Only show groups where at least one model has the same base as another
        shown = 0
        for k, v in sorted(near.items()):
            # Check if these are truly duplicates (same base model, just color/region variant)
            bases = set()
            for name in v:
                base = name
                for word in ['чорна', 'синя', 'червона', 'бронзова', 'сине', 'фіолетова',
                             'чёрная', 'синяя', 'красная', 'бронзовая', 'фиолетовая',
                             'metal', 'atlantic', 'graphite', 'polar', 'ocean', 'teal',
                             'titanium', 'cool', 'sunset', 'red', 'global', 'european',
                             'china', 'poco', 'power', 'oled', 'black', 'blue', 'white',
                             'green', 'gray', 'gold', 'silver', 'purple', 'pink', 'yellow']:
                    if word.capitalize() in base or word.upper() in base:
                        base = re.sub(r'\s+' + re.escape(word.capitalize()) + r'\s*.*', '', base, flags=re.IGNORECASE)
                bases.add(base.strip())
            
            if len(bases) < len(v):
                if shown == 0:
                    print(f"  Color/region variants:")
                shown += 1
                print(f'    Group: {v}')
