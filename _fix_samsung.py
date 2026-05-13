import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

# Find Samsung section
start = data.find("\n    id: 'samsung'\n    name: 'Samsung'")
end = data.find("\n    ]\n  },\n  {\n    id: '", start)

samsung_text = data[start:end]
changes = 0

# Fix specific patterns in modelName within Samsung section
fixes = {
    # Missing spaces: GalaxyNoteN -> Galaxy Note N
    "Galaxy NoteN": "Galaxy Note N",
    # Missing spaces: GalaxyX -> Galaxy X (for Tab models)
    "GalaxyX": "Galaxy X",
    # Double J: GalaxyJJ -> Galaxy J
    "GalaxyJJ": "Galaxy J",
}

for old, new in fixes.items():
    count = samsung_text.count(old)
    if count > 0:
        samsung_text = samsung_text.replace(old, new)
        changes += count
        print(f"  '{old}' -> '{new}': {count} changes")

# Fix tablet P/T codes - add "Galaxy Tab " prefix
# These are modelNames like "P610", "T220", etc.
for m in re.finditer(r"modelName: '([^']+)'", samsung_text):
    name = m.group(1)
    # Check if it's a tablet code (starts with P, T followed by 3 digits)
    if re.match(r'^[PT]\d{3}$', name):
        # Check if it already has "Galaxy Tab" prefix
        full_match = f"modelName: '{name}'"
        replacement = f"modelName: 'Galaxy Tab {name}'"
        samsung_text = samsung_text.replace(full_match, replacement)
        changes += 1
        print(f"  modelName: '{name}' -> 'Galaxy Tab {name}'")

# Fix Note models that now say "Galaxy Note N770" etc. — need to keep as-is
# Actually "Galaxy Note N770" is fine, it's the SM-N770 model

# Reconstruct the file
data = data[:start] + samsung_text + data[end:]

with open(filepath, 'w') as f:
    f.write(data)

print(f"\nTotal changes in Samsung: {changes}")
