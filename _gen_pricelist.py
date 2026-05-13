import re

with open('src/app/phone-parts-data.ts', 'r') as f:
    content = f.read()

# Find Apple section
start = content.find("modelCode: 'iPhone 6'")
end = content.find("    id: 'samsung'", start)

apple_text = content[start:end]

# Parse each iPhone entry
entries = re.findall(r"modelCode: '([^']+)'.*?parts: \{(.*?)\}", apple_text)

models = []
for code, parts_str in entries:
    parts = {}
    # Parse each part: "display: display(350, 600, 200)"
    for m in re.finditer(r"(\w+): (\w+)\(([^)]+)\)", parts_str):
        name = m.group(1)
        func = m.group(2)
        args = [int(x.strip()) for x in m.group(3).split(',')]
        parts[name] = {'func': func, 'args': args}
    models.append({'name': code, 'parts': parts})

# Calculate totals
for m in models:
    total = 0
    for pname, pdata in m['parts'].items():
        func = pdata['func']
        args = pdata['args']
        if func in ('display', 'two'):
            total += args[0] + args[2]  # copy + labor
        elif func == 'only':
            total += args[0] + args[1]  # single part + labor
    m['total_copy'] = total

# Generate HTML
def fmt(name):
    return {
        'display': 'Дисплей',
        'battery': 'АКБ',
        'back_cover': 'Зад.кришка',
        'speaker': 'Динамік',
        'glass': 'Скло',
        'charging_flex': 'Шлейф заряд.',
        'camera': 'Камера',
        'microphone': 'Мікрофон',
        'buttons': 'Кнопки',
        'connector': 'SIM конект.',
    }.get(name, name)

def price(p):
    args = p['args']
    func = p['func']
    if func == 'display':
        copy = args[0] + args[2]
        orig = args[1] + args[2]
        return f"{copy}/{orig}"
    elif func == 'two':
        copy = args[0] + args[2]
        orig = args[1] + args[2]
        return f"{copy}/{orig}"
    elif func == 'only':
        return f"{args[0] + args[1]}"

html = """<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<title>Прайс-лист ремонту iPhone</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 8pt; margin: 0; padding: 10px; }
  h1 { text-align: center; font-size: 14pt; margin: 5px 0; }
  h2 { font-size: 10pt; margin: 3px 0; color: #666; text-align: center; }
  table { border-collapse: collapse; width: 100%; font-size: 7pt; }
  th { background: #333; color: white; padding: 3px 2px; text-align: center; font-size: 6.5pt; }
  td { padding: 2px; text-align: center; border: 1px solid #ccc; }
  td:first-child { text-align: left; font-weight: bold; background: #f5f5f5; }
  tr:nth-child(even) td { background: #fafafa; }
  .total { font-weight: bold; background: #e8f0fe !important; }
  .header { margin-bottom: 10px; }
  .footer { text-align: center; font-size: 7pt; margin-top: 5px; color: #999; }
  .copy { color: #e67e22; }
  .orig { color: #2980b9; }
</style>
</head>
<body>
<div class="header">
  <h1>Прайс-лист ремонту iPhone</h1>
  <h2>Ціни в гривнях (копія/оригінал) — звичайні майстерні</h2>
</div>
<table>
<tr>
  <th>Модель</th>
  <th>Дисплей<br><span class="copy">коп/ор</span></th>
  <th>АКБ<br><span class="copy">коп/ор</span></th>
  <th>Зад.кришка<br><span class="copy">коп/ор</span></th>
  <th>Динамік</th>
  <th>Скло<br><span class="copy">коп/ор</span></th>
  <th>Шлейф заряд.<br><span class="copy">коп/ор</span></th>
  <th>Камера<br><span class="copy">коп/ор</span></th>
  <th>Мікрофон</th>
  <th>Кнопки</th>
  <th>SIM конект.</th>
</tr>
"""

for m in models:
    name_parts = m['name'].split()
    short = ' '.join(name_parts[1:3]) if len(name_parts) > 2 else name_parts[1] if len(name_parts) > 1 else m['name']
    
    def get_price(pname):
        if pname in m['parts']:
            return price(m['parts'][pname])
        return '-'
    
    html += f"<tr><td>{m['name']}</td>"
    html += f"<td>{get_price('display')}</td>"
    html += f"<td>{get_price('battery')}</td>"
    html += f"<td>{get_price('back_cover')}</td>"
    html += f"<td>{get_price('speaker')}</td>"
    html += f"<td>{get_price('glass')}</td>"
    html += f"<td>{get_price('charging_flex')}</td>"
    html += f"<td>{get_price('camera')}</td>"
    html += f"<td>{get_price('microphone')}</td>"
    html += f"<td>{get_price('buttons')}</td>"
    html += f"<td>{get_price('connector')}</td>"
    html += "</tr>\n"

html += """</table>
<div class="footer">
  Прайс-лист 777111.com.ua | Ціни актуальні на травень 2026 | Копія — неоригінальна запчастина
</div>
</body>
</html>"""

with open('/Users/aleksandr/Desktop/iphone_price_list.html', 'w') as f:
    f.write(html)

print(f"Generated HTML price list with {len(models)} models")
print("Saved to ~/Desktop/iphone_price_list.html")
