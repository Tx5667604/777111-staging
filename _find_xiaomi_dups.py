# Find Xiaomi color-variant duplicates to remove
import re

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Models to remove (color-specific variants)
to_remove = [
    "Redmi Note 8 Pro сине-фіолетова",
    "Poco M4 Pro 5G чёрная",
    "Poco M4 Pro 4G чёрная",
    "Poco X3 Pro бронзова Metal",
    "Redmi 8A червона Sunset Red",
    "Redmi Note 11 Pro 5G Atlantic",
    "Redmi Note 11 Pro 5G Graphite",
    "Redmi Note 11 Pro 5G Polar",
    "Redmi Note 13 Pro 5G синя Ocean Teal",
    "Redmi Note 15 Pro 5G Titanium",
    "Redmi 15C 4G Global",
    "Redmi 15C 5G European",
    "Redmi 15 4G Global",
    "Redmi A5 4G Global 168мм",
    "Redmi 6 Global Version на 2 Sim",
]

# Check which ones actually exist in the file
existing = []
for name in to_remove:
    pattern = f"modelCode: '{re.escape(name)}'"
    if re.search(pattern, content):
        existing.append(name)
        print(f"  FOUND: {name}")
    else:
        print(f"  NOT FOUND: {name}")

print(f"\n{len(existing)} models to remove out of {len(to_remove)} listed")
