import re
from collections import Counter, defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Huawei section
start = content.find("id: 'huawei'")
end = content.find("id: '", start + 10)
if end == -1:
    end = content.find("];", start)
    if end > 0:
        end += 2

huawei_section = content[start:end]

codes = re.findall(r"modelCode: '([^']+)'", huawei_section)
print(f'Total models in Huawei: {len(codes)}')
print(f'Unique: {len(set(codes))}')

# Exact duplicates
dup_counts = Counter(codes)
exact = {k: v for k, v in dup_counts.items() if v > 1}
if exact:
    print(f'\nExact duplicates:')
    for k, v in exact.items():
        print(f'  "{k}" - {v} times')

# Near-duplicates: models that differ only by Oled/Oled suffix or color
normalized = defaultdict(list)
for c in codes:
    n = c.lower()
    for word in ['oled', 'dual sim', 'lte', '24mp', '48mp', 'wifi']:
        n = n.replace(word, '')
    n = re.sub(r'\s+', ' ', n).strip()
    normalized[n].append(c)

near = {k: v for k, v in normalized.items() if len(v) > 1}
if near:
    print(f'\nNear-duplicates:')
    for k, v in sorted(near.items()):
        print(f'  Base: "{k}"')
        for name in sorted(v):
            print(f'    - {name}')
        print()
