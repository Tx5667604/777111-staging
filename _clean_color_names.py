import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    data = f.read()

# Remove color descriptors from modelCode and modelName
# These are "побочные имена" — they describe the color/screen, not the model
remove_patterns = [
    # Ukrainian colors
    (r'\s+чорна(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+синя(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+червона(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+сине-фіолетова$', ''),
    (r'\s+бронзова(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+фіолетова$', ''),
    (r'\s+сіра(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+зелена(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+золота(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+біла(?:\s+\w+(?:\s+\w+)?)?$', ''),
    # Russian colors
    (r'\s+чёрная(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+синяя(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+красная(?:\s+\w+(?:\s+\w+)?)?$', ''),
    (r'\s+фиолетовая(?:\s+\w+)?$', ''),
    (r'\s+серебрянная(?:\s+\w+(?:\s+\w+)?)?$', ''),
    # чорний (masculine forms)
    (r'\s+чорний$', ''),
    (r'\s+чёрный$', ''),
    # English color suffixes (standalone at end)
    (r'\s+(?:Black|White|Red|Blue|Gold|Silver|Purple|Pink|Green|Gray|Grey)\s+\w+$', ''),
    # Specific color names that appear with suffixes
    (r'\s+Sunset\s+\w+$', ''),
    (r'\s+Ocean\s+\w+$', ''),
    (r'\s+Mint\s+\w+$', ''),
    (r'\s+Metal\s+\w+$', ''),
    # Model code suffixes like DRA-L21
    (r'\s+[A-Z0-9]+-[A-Z0-9]+\d*$', ''),
    # "на 2 Sim" / "Dual Sim"
    (r'\s+на\s+\d+\s+Sim$', ''),
    (r'\s+Dual\s+Sim$', ''),
]

changes = 0

for line_type in ['modelCode', 'modelName']:
    for m in re.finditer(f"{line_type}: '([^']+)'", data):
        old_name = m.group(1)
        new_name = old_name
        
        for pattern, replacement in remove_patterns:
            new_name = re.sub(pattern, replacement, new_name)
        
        # Clean up
        new_name = re.sub(r'\s+', ' ', new_name).strip()
        
        if new_name != old_name:
            old_str = f"{line_type}: '{old_name}'"
            new_str = f"{line_type}: '{new_name}'"
            data = data.replace(old_str, new_str, 1)
            changes += 1
            print(f"  {line_type}: '{old_name}' -> '{new_name}'")

with open(filepath, 'w') as f:
    f.write(data)

print(f"\nTotal changes: {changes}")
