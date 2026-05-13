import re
from hermes_tools import terminal

# Check all color variant models against their potential bases
variants = {
    'xiaomi': [
        ('Poco M4 Pro 5G чёрная', 'Poco M4 Pro 5G'),
        ('Redmi Note 8 Pro сине-фіолетова', 'Redmi Note 8 Pro'),
        ('Redmi Note 11 Pro 5G Atlantic Blue', 'Redmi Note 11 Pro 5G'),
        ('Redmi Note 11 Pro 5G Graphite Gray', 'Redmi Note 11 Pro 5G'),
        ('Redmi Note 11 Pro 5G Polar White', 'Redmi Note 11 Pro 5G'),
        ('Redmi Note 15 Pro 5G Titanium', 'Redmi Note 15 Pro 5G'),
    ],
    'oppo': [
        ('A3x 4G бордова Nebula Red', 'A3x 4G'),
        ('A52 12MP', 'A52'),
        ('A15 2020', 'A15'),
        ('A18 2023', 'A18'),
        ('A31 2020', 'A31'),
        ('A5 2020', 'A5'),
        ('A3 2018', 'A3'),
        ('A96', 'A96 4G'),  # A96 might be the same as A96 4G
    ],
    'huawei': [
        ('P30 Lite 24MP Black', 'P30 Lite'),
        ('P30 Lite 48MP', 'P30 Lite'),
        ('Honor 60 Oled', 'Honor 60'),
        ('Honor 70 Oled', 'Honor 70'),
    ],
    'realme': [
        ('7 AMOLED чорний', '7'),
        ('Nord 3 5G AMOLED чорний', 'Nord 3 5G'),
        ('Nord CE4 Lite 5G OLED чорний', 'Nord CE4 Lite 5G'),
    ],
}

for brand, pairs in variants.items():
    print(f"\n=== {brand.upper()} ===")
    for variant, base in pairs:
        r = terminal(f"grep -c \"modelCode: '{base}'\" src/app/phone-parts-data.ts", timeout=10, workdir="/Users/aleksandr/Desktop/777111-temp")
        base_exists = r["output"].strip()
        r2 = terminal(f"grep -c \"modelCode: '{variant}'\" src/app/phone-parts-data.ts", timeout=10, workdir="/Users/aleksandr/Desktop/777111-temp")
        variant_exists = r2["output"].strip()
        
        if variant_exists != "0" and base_exists != "0":
            print(f"  SAFE: {variant} -> base: {base}")
        elif variant_exists != "0" and base_exists == "0":
            print(f"  SKIP: {variant} -> base {base} NOT FOUND")
        else:
            print(f"  NOT FOUND: {variant}")
