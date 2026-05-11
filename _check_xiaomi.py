import re
from collections import Counter, defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Xiaomi section
start = content.find("id: 'xiaomi'")
end = content.find("id: '", start + 10)
if end == -1:
    end = content.find("];", start)
    if end > 0:
        end += 2

xiaomi_section = content[start:end]

# Extract all modelCodes
codes = re.findall(r"modelCode: '([^']+)'", xiaomi_section)
print(f'Total models in Xiaomi: {len(codes)}')
print(f'Unique modelCodes: {len(set(codes))}')

# Find exact duplicates
dup_counts = Counter(codes)
exact_dups = {k: v for k, v in dup_counts.items() if v > 1}
if exact_dups:
    print(f'\n\nExact duplicates:')
    for k, v in exact_dups.items():
        print(f'  "{k}" - appears {v} times')

# Check for near-duplicates (color variant duplicates)
# Group by model name minus color/region descriptors
normalized = defaultdict(list)
for c in codes:
    # Remove color/region descriptors
    n = c.lower()
    # Common color/region words to strip
    for word in ['чорна', 'синя', 'червона', 'бронзова', 'сине', 'фіолетова',
                 'чёрная', 'синяя', 'красная', 'бронзовая', 'фиолетовая',
                 'metal', 'atlantic', 'graphite', 'polar', 'ocean', 'teal',
                 'titanium', 'cool', 'sunset', 'red', 'global', 'european',
                 'china', 'poco', 'power', 'version', 'на']:
        n = n.replace(word, '')
    n = re.sub(r'\s+', ' ', n).strip().strip('-').strip()
    if n:
        normalized[n].append(c)

color_dups = {k: v for k, v in normalized.items() if len(v) > 1 and v[0] != v[1]}
if color_dups:
    print(f'\n\nModels differing only by color/region:')
    for k, v in sorted(color_dups.items()):
        print(f'  Base: "{k}"')
        for name in sorted(v):
            print(f'    - {name}')
        print()
