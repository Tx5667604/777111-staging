import re
from collections import defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Oppo section
start = content.find("id: 'oppo'")
end = content.find("id: '", start + 10)
if end == -1:
    end = content.find("];", start)
    if end > 0:
        end += 2

section = content[start:end]
codes = re.findall(r"modelCode: '([^']+)'", section)
print(f"Total models in Oppo: {len(codes)}")

# Near-duplicates
normalized = defaultdict(list)
for c in codes:
    n = c.lower()
    for word in ['4g', '5g', '2020', '2023', '2018', 'amoled',
                 'чорна', 'синя', 'бордова', 'чёрная']:
        n = n.replace(word, '')
    # Remove Nebula Red etc.
    n = re.sub(r'\s+[a-z]+\s+[a-z]+', '', n)
    n = re.sub(r'\s+', ' ', n).strip()
    normalized[n].append(c)

print("\n=== Near-duplicates ===")
for k, v in sorted(normalized.items()):
    if len(v) > 1:
        names_norm = set()
        for name in v:
            base = re.sub(r'\s+\d+MP|\s+202\d|\s+4G|\s+5G|\s+Amoled', '', name)
            names_norm.add(base.strip())
        if len(names_norm) < len(v):
            print(f"  {v}")
