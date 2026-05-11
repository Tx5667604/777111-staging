import re
from collections import defaultdict

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Motorola section
start = content.find("id: 'motorola'")
end = content.find("id: '", start + 10)
if end == -1:
    end = content.find("];", start)
    if end > 0:
        end += 2

section = content[start:end]

# Extract all modelCodes
codes = re.findall(r"modelCode: '([^']+)'", section)
print(f'Total models in Motorola: {len(codes)}')

# Find "Корпу" 
print("\n=== 'Корпу' entries ===")
for c in codes:
    if 'Корп' in c or 'корп' in c:
        print(f"  {c}")

# Find near-duplicates by XT code prefix
print("\n=== Duplicate models with same XT code ===")
xt_groups = defaultdict(list)
for c in codes:
    # Extract XT code (e.g., XT1924)
    m = re.match(r'(XT\d+)', c)
    if m:
        xt = m.group(1)
        xt_groups[xt].append(c)

for xt, models in sorted(xt_groups.items()):
    if len(models) > 1:
        print(f"  {xt}:")
        for m in sorted(models):
            print(f"    - {m}")
        print()

# Find other models with same name but different XT code
print("\n=== Same model name with different XT codes ===")
name_groups = defaultdict(list)
for c in codes:
    # Extract model name after XT code
    m = re.match(r'XT\d+[-0-9]*\s+(.+)$', c)
    if m:
        name_groups[m.group(1)].append(c)

for name, models in sorted(name_groups.items()):
    if len(models) > 1:
        print(f"  \"{name}\":")
        for m in sorted(models):
            print(f"    - {m}")
        print()
