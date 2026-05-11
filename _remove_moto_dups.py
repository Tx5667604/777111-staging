import re

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Motorola section
start = content.find("id: 'motorola'")
end_section = content.find("\n    ]\n  },\n  {\n    id: '", start + 10)
if end_section == -1:
    end_section = content.find("];", start) + 2

motorola_section = content[start:end_section]

# Models to remove (color/label variants or duplicates)
# Pattern: match the entire model object including opening brace
remove_patterns = [
    # Color variants
    ("One Action Denim Blue", None),  # remove color variant
    ("E7 Plus Misty Blue", "E7 Plus"),  # color variant, base exists
    ("Moto G60 Black", "G60"),  # color variant
    ("G200 5G", "Moto G200 5G"),  # shorter name, longer name exists
    ("Moto G200 Blue", None),  # color variant
    ("G32 сіра Mineral Grey", None),  # color variant
    ("G72 сіра Meteorite Gray", None),  # color variant
    ("G84 червона Viva Magenta", None),  # color variant
    ("G50 5G сіра Meteorite Grey", None),  # color variant
    ("Moto E7 Power", "E7 Power"),  # choose Moto E7 Power (more complete)
    ("XT2113-3", "Moto G 5G"),  # numeric only, base exists
    ("XT1924-6-7-8", "XT1924-1-2-3-4-5"),  # similar model
    ("Корпу", None),  # data entry error
]

for pattern, keep in remove_patterns:
    if pattern == "Корпу":
        # Remove Корпу entry
        # Find the model block containing Корпу
        match = re.search(r"\{[^}]*Корпу[^}]*\}", motorola_section)
        if match:
            block = match.group(0)
            # Remove the entire model entry including comma
            full = re.escape(block)
            content = content.replace(block + ",\n", "", 1)
            print(f"  REMOVED: Корпу")
        else:
            print(f"  NOT FOUND: Корпу")
    else:
        # Find modelCode with this pattern
        escaped = re.escape(pattern)
        match = re.search(r"\{\s*\n\s*modelCode: '[^']*" + escaped + r"[^']*',\s*\n", content)
        if match:
            block_start = match.start()
            # Find end of this model block
            depth = 0
            pos = block_start
            while pos < len(content):
                if content[pos] == '{':
                    depth += 1
                elif content[pos] == '}':
                    depth -= 1
                    if depth == 0:
                        block_end = pos + 1
                        break
                pos += 1
            
            block = content[block_start:block_end]
            # Remove block and following comma/newline
            content = content[:block_start] + content[block_end:]
            # Clean up extra commas
            content = content.replace(",,\n      {\n", ",\n      {\n", 1).replace(",,", ",")
            content = re.sub(r",\s*\n\s*\]", "\n      ]", content)
            print(f"  REMOVED: {pattern}")
        else:
            print(f"  NOT FOUND: {pattern}")

with open('src/app/phone-parts-data.ts', 'w') as f:
    f.write(content)

print("\nDone!")
