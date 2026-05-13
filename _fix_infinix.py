import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

# Models to remove (variant codes where base exists)
to_remove = [
    "Camon 17P CG7n",
    "Camon 20 CK6",
    "Smart 8 X6525",
    "Pop 2 Power B1P",
]

for code in to_remove:
    idx = data.find(f"modelCode: '{code}'")
    if idx < 0:
        print(f"NOT FOUND: {code}")
        continue
    
    # Find opening {
    brace_start = data.rfind('{', 0, idx)
    # Find closing }
    brace_end = data.find('\n      }', idx) + 8
    
    # Include trailing comma
    if data[brace_end] == ',':
        brace_end += 1
    
    block = data[brace_start:brace_end]
    data = data[:brace_start] + data[brace_end:]
    print(f"REMOVED: {code} ({len(block)} chars)")

# Also fix Zero 30 IPS -> Zero 30 (rename, not remove)
data = data.replace("modelCode: 'Zero 30 IPS'", "modelCode: 'Zero 30'")
print("RENAMED: Zero 30 IPS -> Zero 30")

with open(filepath, 'w') as f:
    f.write(data)

print("\nDone!")
