import re

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Models to remove (color/camera/year variants where base exists)
to_remove = [
    # XIAOMI
    "Poco M4 Pro 4G чёрная",
    "Poco M4 Pro 5G чёрная",
    "Poco X3 Pro бронзова Metal Bronze",
    "Redmi 8A червона Sunset Red",
    "Redmi Note 8 Pro сине-фіолетова",
    "Redmi Note 11 Pro 5G Atlantic Blue",
    "Redmi Note 11 Pro 5G Graphite Gray",
    "Redmi Note 11 Pro 5G Polar White",
    "Redmi Note 15 Pro 5G Titanium",
    
    # HUAWEI
    "P30 Lite 24MP Black",
    "P30 Lite 48MP",
    
    # OPPO
    "A3x 4G бордова Nebula Red",
    "A52 12MP",
    "A15 2020",
    "A18 2023",
    "A31 2020",
    "A5 2020",
    "A3 2018",
    
    # MOTOROLA
    "XT2013-1 One Action Denim Blue",
    "XT2081 Moto E7 Plus Misty Blue",
    "XT2135 Moto G60 Black",
    "XT2175-1 G200 5G",
    "XT2175-1 Moto G200 Blue",
    "XT2235-2 Moto G32 сіра Mineral Grey",
    "XT2255-1 Moto G72 сіра Meteorite Gray",
    "XT2347-2 Moto G84 червона Viva Magenta",
    "XT2149-1 Moto G50 5G сіра Meteorite Grey",
    "XT2113-3",
    "XT1924-6-7-8 Moto E5 Plus",
    
    # VIVO
    "V17 Ocean Black",
    
    # REALME
    "7 AMOLED чорний",
    "Nord 3 5G AMOLED чорний",
    "Nord 3 TFT чорний",
    "Nord 4 5G чорний",
    "Nord CE 2 Lite 5G чорний",
    "Nord CE 3 Lite 5G чорний",
    "Nord CE4 Lite 5G OLED чорний",
    "Nord N10 5G чорний",
    "Nord N100 чорний",
    
    # SONY
    "G3412 Xperia XA1 Plus Dual чорний",
    "6 OLED чорний",
    "7 OLED чорний",
    "7 Pro OLED чорний",
    "8 Pro OLED чорний",
    "8A OLED чорний",
    "9 OLED чорний",
    "9 Pro OLED чорний",
    
    # NUBIA
    "Nubia M2 X551J OLED",
    
    # INFINIX
    "Hot 10S чорний",
    "Hot 11 чорний",
    "Hot 12 Play чорний",
    "Hot 12 чорний",
    "Hot 20 5G чорний",
    "Hot 20i чорний",
    "Hot 30i чорний",
    "Hot 40i чорний",
    "Hot 50 Pro 4G чорна Sleek Black",
    "Hot 60i 4G серебрянная Titanium Silver",
    "Note 30i TFT чорний",
    
    # INFINIX
    "Smart 6 X6511 чорний",
    
    # Y91 / HUAWEI area
    "Y91 сине-фіолетова",
    
    # CORPU
    "Корпу",
]

removed_count = 0
for model in to_remove:
    # Build regex to find and remove the entire model block
    escaped = re.escape(model)
    
    # Match from { to the next complete model block
    pattern = r"\{\n\s*modelCode: '" + escaped + r"'.*?\n\s*\}(,)?"
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        block = match.group(0)
        comma_after = match.group(1) or ""
        
        # Remove the block and clean up
        start = match.start()
        end = match.end()
        
        # If there's a comma after the closing brace, remove it too
        content = content[:start] + content[end:]
        
        # Remove leftover comma + newline before next block
        content = re.sub(r",\s*\n\s*\{", ",\n        {", content)
        
        removed_count += 1
        print(f"  REMOVED: {model}")
    else:
        print(f"  NOT FOUND: {model}")

# Also fix "14 Ultra OLED" -> "14 Ultra" if "14 Ultra" exists without OLED
# Fix OLED suffixes where the base model already exists

with open('src/app/phone-parts-data.ts', 'w') as f:
    f.write(content)

print(f"\nTotal removed: {removed_count}")
