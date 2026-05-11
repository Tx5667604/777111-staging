import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

codes_to_remove = [
    # Lenovo duplicates
    "Tab P11 2nd Gen TB350FU",
    "Tab P12 TB370FU",
    # Motorola error
    "Корпу",
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
