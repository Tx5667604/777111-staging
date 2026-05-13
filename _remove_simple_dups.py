import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

codes_to_remove = [
    # Xiaomi color variants
    "Poco M4 Pro 5G чёрная",
    "Redmi Note 8 Pro сине-фіолетова",
    "Redmi Note 11 Pro 5G Atlantic Blue",
    "Redmi Note 11 Pro 5G Graphite Gray",
    "Redmi Note 11 Pro 5G Polar White",
    "Redmi Note 15 Pro 5G Titanium",
    # Oppo year/camera variants
    "A52 12MP",
    "A15 2020",
    "A18 2023",
    "A31 2020",
    "A5 2020",
    "A3 2018",
    # Huawei camera variants
    "P30 Lite 24MP Black",
    "P30 Lite 48MP",
]

for code in codes_to_remove:
    pattern = f"modelCode: '{re.escape(code)}'"
    idx = data.find(f"modelCode: '{code}'")
    if idx < 0:
        print(f"NOT FOUND: {code}")
        continue
    
    # Find the opening { of this model block
    # Go backwards to find the { that starts this entry
    brace_start = data.rfind('{', 0, idx)
    # Go forward to find the } that ends this block (with comma)
    brace_end = data.find('\n      }', idx)
    if brace_end < 0:
        print(f"CANNOT FIND END: {code}")
        continue
    brace_end += 8  # include the }
    
    # Remove trailing comma if present
    end_trim = brace_end
    if end_trim < len(data) and data[end_trim] == ',':
        end_trim += 1
    
    removed = data[brace_start:end_trim]
    data = data[:brace_start] + data[end_trim:]
    
    # Clean up double commas
    data = data.replace(',\n\n', ',\n')
    data = data.replace(',\n    ]', '\n    ]')
    
    print(f"REMOVED: {code} ({len(removed)} chars)")

with open(filepath, 'w') as f:
    f.write(data)

print(f"\nFile size: {len(data)} chars")
