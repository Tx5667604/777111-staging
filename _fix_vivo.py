import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

# Vivo fixes
fixes = [
    # Remove V17 Blue (color variant of V17)
    ("V17 Blue", "V17"),  # modelCode with Blue, modelName already correct
    
    # Fix Y21s Blue -> Y21s
    ("Y21s Blue", "Y21s"),
    
    # Fix Y36 5G Black -> Y36 5G
    ("Y36 5G Black", "Y36 5G"),
    
    # Fix Y91c Blue -> Y91c
    ("Y91c Blue", "Y91c"),
    
    # Fix Y77 China -> Y77
    ("Y77 China", "Y77"),
]

changes = 0
for old, new in fixes:
    # Fix in modelCode
    old_mc = f"modelCode: '{old}'"
    new_mc = f"modelCode: '{new}'"
    if old_mc in data:
        data = data.replace(old_mc, new_mc, 1)
        changes += 1
        print(f"  {old_mc} -> {new_mc}")
    
    # Fix in modelName
    old_mn = f"modelName: '{old}'"
    new_mn = f"modelName: '{new}'"
    if old_mn in data:
        data = data.replace(old_mn, new_mn, 1)
        changes += 1
        print(f"  {old_mn} -> {new_mn}")

# Remove duplicate Y91 in Vivo section  
# Find second Y91 in Vivo (both modelCode and modelName = Y91)
# Need to find and remove the duplicate Y91 model block
vivo_start = data.find("id: 'vivo'")
vivo_end = data.find("\n    ]\n  },\n  {\n    id: 'realme'", vivo_start)
vivo_section = data[vivo_start:vivo_end]

# Find all Y91 entries in Vivo
y91_positions = [m.start() for m in re.finditer("modelCode: 'Y91'", vivo_section)]
if len(y91_positions) >= 2:
    # Find the SECOND one's full block
    second_pos = vivo_start + y91_positions[1]
    
    # Find opening {
    brace_start = data.rfind('{', 0, second_pos)
    # Find closing }
    brace_end = data.find('\n      }', second_pos)
    if brace_end > 0:
        brace_end += 8
    
    # Include trailing comma
    if data[brace_end] == ',':
        brace_end += 1
    
    block = data[brace_start:brace_end]
    data = data[:brace_start] + data[brace_end:]
    print(f"\n  Removed duplicate Y91 in Vivo ({len(block)} chars)")

with open(filepath, 'w') as f:
    f.write(data)

print(f"\nTotal changes: {changes}")
