import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

# Rename models: remove screen type descriptors from modelCode and modelName
# Patterns to remove from model names
remove_patterns = [
    # Screen types - remove from anywhere in name
    (r'\s+OLED', ''),
    (r'\s+AMOLED', ''),
    (r'\s+P-OLED', ''),
    (r'\s+TFT', ''),
    (r'\s+INCELL', ''),
    (r'\s+Oled', ''),
    (r'\s+Amoled', ''),
]

changes = 0

# Find all modelCode and modelName entries
for line_type in ['modelCode', 'modelName']:
    for m in re.finditer(f"{line_type}: '([^']+)'", data):
        old_name = m.group(1)
        new_name = old_name
        
        for pattern, replacement in remove_patterns:
            new_name = re.sub(pattern, '', new_name)
        
        # Clean up double spaces
        new_name = re.sub(r'\s+', ' ', new_name).strip()
        
        if new_name != old_name:
            # Replace in data
            old_str = f"{line_type}: '{old_name}'"
            new_str = f"{line_type}: '{new_name}'"
            data = data.replace(old_str, new_str, 1)
            changes += 1
            print(f"  {line_type}: '{old_name}' -> '{new_name}'")

with open(filepath, 'w') as f:
    f.write(data)

print(f"\nTotal changes: {changes}")
