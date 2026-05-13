import re

filepath = 'src/app/phone-parts-data.ts'

with open(filepath, 'r') as f:
    lines = f.readlines()

# Lines 30-53 (0-indexed: 29-52) contain the Apple models section
# Line 29 = "    models: ["
# Line 52 = the last model entry line
# Line 53 = "    ],\n  },\n  { (but actually this ends the section)
# We need to replace lines 29-52 (models: [ through the last model)

print(f"Line 30 (0-idx 29): {repr(lines[29])}")
print(f"Line 53 (0-idx 52): {repr(lines[52])}")
print(f"Line 54 (0-idx 53): {repr(lines[53])}")
