import re
from collections import defaultdict

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
names = re.findall(r"modelName: '([^']+)'", huawei_section)

# Check for specific issues mentioned: Oled, P Smart Z / P Smart Z 2019, etc.
print("=== Checking specific issues ===")

# 1. Honor 60 Oled / Honor 70 Oled
print("\nOLED models:")
for c in codes:
    if 'oled' in c.lower():
        print(f"  {c}")

# 2. P30 Lite variants
print("\nP30 Lite variants:")
for c in codes:
    if 'P30 Lite' in c:
        print(f"  {c}")

# 3. P Smart Z
print("\nP Smart Z:")
for c in codes:
    if 'P Smart Z' in c or 'P Smart' in c:
        print(f"  {c}")

# 4. P8 Lite
print("\nP8 Lite:")
for c in codes:
    if 'P8 Lite' in c:
        print(f"  {c}")

# 5. Y5 and Y6 variants
print("\nY5/Y6 variants:")
for c in codes:
    if c.startswith('Y5') or c.startswith('Y6'):
        print(f"  {c}")

# 6. Any Honor models
print("\nHonor models count:", sum(1 for c in codes if c.startswith('Honor')))

# 7. Check for models that have same base name but different suffixes
normalized = defaultdict(list)
for c in codes:
    n = c.lower()
    for word in ['oled', 'dual sim', 'lte', '24mp', '48mp', '2017', '2018', '2019', '2021']:
        n = n.replace(word, '')
    # Remove model codes like DRA-L21
    n = re.sub(r'[a-z0-9]+-[a-z0-9]+', '', n)
    n = re.sub(r'\s+', ' ', n).strip()
    normalized[n].append(c)

print("\n=== All near-duplicates in Huawei ===")
for k, v in sorted(normalized.items()):
    if len(v) > 1:
        print(f'\n  Base: "{k}"')
        for name in sorted(v):
            print(f'    - {name}')
