import os, json
os.system("cd ~/Desktop/777111-temp && git checkout -- src/app/phone-parts-data.ts")

with open("src/app/phone-parts-data.ts", "r") as f:
    data = f.read()

# Find markers
apple_start = data.find("    models: [\n", data.find("id: 'apple'"))
end_marker = "\n    ],\n  },\n  {\n    id: 'samsung'"
apple_end = data.find(end_marker, apple_start)

print(f"apple_start={apple_start} apple_end={apple_end}")

before = data[:apple_start]
after = data[apple_end:]  # starts with "\n    ],\n  },\n  {\n    id: 'samsung'"
# Trim the leading "\n    ]," since new_apple already ends with "\n    ]"
after = after[len("\n    ],"):]  # remove extra closing bracket

# Build 34 iPhone entries with LOW prices
models = [
    ("iPhone 6", "display: display(350, 600, 200), battery: two(250, 450, 150), back_cover: two(200, 300, 150), speaker: only(200, 150), glass: two(250, 600, 250), charging_flex: two(150, 250, 150), camera: two(200, 350, 150), microphone: only(150, 150), buttons: only(200, 150), connector: only(150, 150)"),
    ("iPhone 6 Plus", "display: display(400, 700, 250), battery: two(250, 500, 150), back_cover: two(200, 350, 150), speaker: only(250, 150), glass: two(300, 700, 250), charging_flex: two(150, 250, 150), camera: two(250, 400, 150), microphone: only(200, 150), buttons: only(200, 150), connector: only(150, 150)"),
    ("iPhone 6s", "display: display(450, 800, 200), battery: two(300, 500, 150), back_cover: two(250, 400, 150), speaker: only(250, 150), glass: two(300, 700, 200), charging_flex: two(150, 300, 150), camera: two(250, 400, 150), microphone: only(200, 150), buttons: only(250, 150), connector: only(200, 150)"),
    ("iPhone 6s Plus", "display: display(550, 1000, 250), battery: two(300, 550, 150), back_cover: two(300, 450, 150), speaker: only(300, 150), glass: two(400, 900, 250), charging_flex: two(200, 300, 150), camera: two(300, 450, 150), microphone: only(250, 150), buttons: only(250, 150), connector: only(200, 150)"),
    ("iPhone 7", "display: display(550, 1000, 250), battery: two(350, 550, 150), back_cover: two(300, 450, 200), speaker: only(300, 150), glass: two(350, 900, 250), charging_flex: two(200, 350, 150), camera: two(300, 500, 150), microphone: only(250, 150), buttons: only(250, 150), connector: only(200, 150)"),
    ("iPhone 7 Plus", "display: display(700, 1300, 300), battery: two(400, 600, 150), back_cover: two(350, 500, 200), speaker: only(350, 150), glass: two(450, 1200, 300), charging_flex: two(250, 400, 150), camera: two(350, 550, 150), microphone: only(300, 150), buttons: only(300, 150), connector: only(250, 150)"),
    ("iPhone 8", "display: display(650, 1200, 250), battery: two(400, 650, 150), back_cover: two(350, 500, 200), speaker: only(350, 150), glass: two(400, 1000, 250), charging_flex: two(250, 400, 200), camera: two(350, 550, 150), microphone: only(300, 150), buttons: only(300, 150), connector: only(250, 150)"),
    ("iPhone 8 Plus", "display: display(800, 1700, 300), battery: two(450, 700, 150), back_cover: two(400, 550, 200), speaker: only(400, 150), glass: two(500, 1300, 300), charging_flex: two(250, 450, 200), camera: two(400, 600, 150), microphone: only(350, 150), buttons: only(350, 150), connector: only(300, 150)"),
    ("iPhone SE", "display: display(400, 700, 200), battery: two(250, 450, 150), back_cover: two(200, 300, 150), speaker: only(200, 150), glass: two(250, 600, 200), charging_flex: two(150, 250, 150), camera: two(200, 350, 150), microphone: only(150, 150), buttons: only(200, 150), connector: only(150, 150)"),
    ("iPhone SE 2020", "display: display(1000, 1800, 250), battery: two(500, 900, 200), back_cover: two(450, 700, 200), speaker: only(350, 150), glass: two(500, 1300, 300), charging_flex: two(350, 550, 200), camera: two(400, 700, 200), microphone: only(300, 150), buttons: only(300, 150), connector: only(250, 150)"),
    ("iPhone X", "display: display(1200, 2500, 400), battery: two(700, 1200, 250), back_cover: two(600, 1000, 300), speaker: only(400, 200), glass: two(650, 1800, 400), charging_flex: two(400, 650, 250), camera: two(500, 900, 250), microphone: only(350, 200), buttons: only(350, 200), connector: only(300, 200)"),
    ("iPhone XR", "display: display(1000, 2200, 350), battery: two(600, 1000, 250), back_cover: two(550, 900, 250), speaker: only(350, 200), glass: two(550, 1500, 350), charging_flex: two(350, 550, 250), camera: two(450, 800, 250), microphone: only(300, 200), buttons: only(300, 200), connector: only(250, 200)"),
    ("iPhone XS", "display: display(1500, 3000, 400), battery: two(700, 1200, 250), back_cover: two(700, 1100, 300), speaker: only(400, 200), glass: two(700, 2000, 400), charging_flex: two(400, 650, 250), camera: two(550, 1000, 250), microphone: only(350, 200), buttons: only(350, 200), connector: only(300, 200)"),
    ("iPhone XS Max", "display: display(2000, 3800, 450), battery: two(800, 1300, 250), back_cover: two(800, 1200, 350), speaker: only(450, 250), glass: two(900, 2500, 450), charging_flex: two(450, 700, 250), camera: two(650, 1200, 300), microphone: only(400, 250), buttons: only(400, 250), connector: only(350, 200)"),
    ("iPhone 11", "display: display(1200, 2500, 350), battery: two(700, 1100, 250), back_cover: two(700, 1000, 300), speaker: only(400, 200), glass: two(700, 1800, 400), charging_flex: two(400, 650, 250), camera: two(550, 1000, 300), microphone: only(350, 200), buttons: only(350, 200), connector: only(300, 200)"),
    ("iPhone 11 Pro", "display: display(1800, 3800, 450), battery: two(800, 1400, 300), back_cover: two(900, 1400, 350), speaker: only(450, 250), glass: two(900, 2300, 450), charging_flex: two(500, 800, 300), camera: two(700, 1500, 350), microphone: only(400, 250), buttons: only(400, 250), connector: only(350, 200)"),
    ("iPhone 11 Pro Max", "display: display(2200, 4500, 500), battery: two(900, 1500, 300), back_cover: two(1000, 1600, 400), speaker: only(500, 250), glass: two(1200, 2800, 500), charging_flex: two(550, 900, 300), camera: two(900, 1800, 400), microphone: only(450, 250), buttons: only(450, 250), connector: only(400, 250)"),
    ("iPhone 12", "display: display(1500, 3200, 400), battery: two(800, 1400, 300), back_cover: two(800, 1300, 350), speaker: only(450, 250), glass: two(900, 2200, 400), charging_flex: two(500, 800, 300), camera: two(700, 1500, 350), microphone: only(400, 250), buttons: only(400, 250), connector: only(350, 250)"),
    ("iPhone 12 Pro", "display: display(2200, 4500, 500), battery: two(900, 1500, 300), back_cover: two(1000, 1600, 400), speaker: only(500, 250), glass: two(1200, 2800, 500), charging_flex: two(550, 900, 300), camera: two(900, 2000, 400), microphone: only(450, 250), buttons: only(450, 250), connector: only(400, 250)"),
    ("iPhone 12 Pro Max", "display: display(2800, 5500, 550), battery: two(1000, 1700, 350), back_cover: two(1200, 1800, 450), speaker: only(550, 300), glass: two(1400, 3200, 550), charging_flex: two(600, 1000, 350), camera: two(1200, 2500, 450), microphone: only(500, 300), buttons: only(500, 300), connector: only(450, 300)"),
    ("iPhone 13", "display: display(1800, 3800, 450), battery: two(900, 1600, 350), back_cover: two(900, 1400, 400), speaker: only(500, 250), glass: two(1200, 2500, 500), charging_flex: two(550, 1000, 350), camera: two(900, 1800, 400), microphone: only(450, 250), buttons: only(450, 250), connector: only(400, 300)"),
    ("iPhone 13 Pro", "display: display(2800, 5500, 550), battery: two(1100, 1900, 350), back_cover: two(1200, 1800, 450), speaker: only(550, 300), glass: two(1400, 3200, 550), charging_flex: two(650, 1100, 350), camera: two(1200, 2600, 450), microphone: only(500, 300), buttons: only(500, 300), connector: only(450, 300)"),
    ("iPhone 13 Pro Max", "display: display(3500, 6500, 600), battery: two(1200, 2000, 400), back_cover: two(1400, 2200, 500), speaker: only(600, 300), glass: two(1700, 4000, 600), charging_flex: two(700, 1300, 400), camera: two(1500, 3000, 550), microphone: only(550, 300), buttons: only(550, 300), connector: only(500, 350)"),
    ("iPhone 14", "display: display(2000, 4000, 450), battery: two(1000, 1700, 350), back_cover: two(1000, 1500, 400), speaker: only(500, 250), glass: two(1300, 2800, 500), charging_flex: two(600, 1100, 350), camera: two(1000, 2000, 400), microphone: only(450, 250), buttons: only(450, 250), connector: only(400, 300)"),
    ("iPhone 14 Plus", "display: display(2200, 4500, 500), battery: two(1100, 1800, 350), back_cover: two(1100, 1800, 450), speaker: only(550, 300), glass: two(1400, 3200, 550), charging_flex: two(650, 1200, 350), camera: two(1100, 2200, 400), microphone: only(500, 300), buttons: only(500, 300), connector: only(450, 300)"),
    ("iPhone 14 Pro", "display: display(3500, 7000, 650), battery: two(1200, 2000, 400), back_cover: two(1400, 2200, 500), speaker: only(600, 300), glass: two(1800, 4200, 650), charging_flex: two(700, 1300, 400), camera: two(1800, 3500, 550), microphone: only(550, 300), buttons: only(550, 300), connector: only(500, 350)"),
    ("iPhone 14 Pro Max", "display: display(4000, 8000, 700), battery: two(1300, 2200, 450), back_cover: two(1500, 2500, 550), speaker: only(650, 350), glass: two(2000, 4800, 700), charging_flex: two(800, 1500, 450), camera: two(2000, 4000, 650), microphone: only(600, 350), buttons: only(600, 350), connector: only(550, 400)"),
    ("iPhone 15", "display: display(2500, 5000, 500), battery: two(1200, 2000, 400), back_cover: two(1200, 1800, 450), speaker: only(550, 300), glass: two(1500, 3200, 550), charging_flex: two(700, 1300, 400), camera: two(1200, 2500, 450), microphone: only(500, 300), buttons: only(500, 300), connector: only(450, 350)"),
    ("iPhone 15 Plus", "display: display(2800, 5500, 550), battery: two(1300, 2200, 400), back_cover: two(1300, 2000, 500), speaker: only(600, 350), glass: two(1600, 3500, 600), charging_flex: two(750, 1400, 400), camera: two(1400, 2800, 500), microphone: only(550, 350), buttons: only(550, 350), connector: only(500, 400)"),
    ("iPhone 15 Pro", "display: display(3800, 7500, 700), battery: two(1400, 2400, 450), back_cover: two(1500, 2500, 550), speaker: only(650, 350), glass: two(2000, 4500, 700), charging_flex: two(800, 1500, 450), camera: two(2000, 4000, 650), microphone: only(600, 350), buttons: only(600, 350), connector: only(550, 400)"),
    ("iPhone 15 Pro Max", "display: display(4500, 8500, 800), battery: two(1500, 2600, 450), back_cover: two(1800, 3000, 600), speaker: only(700, 400), glass: two(2500, 5500, 800), charging_flex: two(900, 1700, 450), camera: two(2500, 5000, 750), microphone: only(650, 400), buttons: only(650, 400), connector: only(600, 450)"),
    ("iPhone 16", "display: display(2800, 5500, 550), battery: two(1300, 2200, 400), back_cover: two(1300, 2000, 500), speaker: only(600, 350), glass: two(1700, 3800, 600), charging_flex: two(750, 1400, 400), camera: two(1400, 2800, 500), microphone: only(550, 350), buttons: only(550, 350), connector: only(500, 400)"),
    ("iPhone 16 Pro", "display: display(4000, 8000, 750), battery: two(1500, 2500, 450), back_cover: two(1800, 2800, 600), speaker: only(700, 400), glass: two(2200, 5000, 750), charging_flex: two(850, 1600, 450), camera: two(2200, 4600, 700), microphone: only(650, 400), buttons: only(650, 400), connector: only(600, 450)"),
    ("iPhone 16 Pro Max", "display: display(5000, 9500, 850), battery: two(1600, 2800, 500), back_cover: two(2000, 3500, 650), speaker: only(750, 450), glass: two(2800, 6000, 850), charging_flex: two(1000, 1900, 500), camera: two(2800, 5500, 800), microphone: only(700, 450), buttons: only(700, 450), connector: only(650, 500)"),
]

# Build the models array lines
entries = []
for model, parts in models:
    entries.append(f"      {{ modelCode: '{model}', modelName: '{model}', parts: {{ {parts} }} }},")

new_apple = "    models: [\n" + "\n".join(entries) + "\n    ]"

data = before + new_apple + after

with open("src/app/phone-parts-data.ts", "w") as f:
    f.write(data)

print(f"Done! Replaced Apple section with {len(models)} models.")
