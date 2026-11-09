# -*- coding: utf-8 -*-
"""把 character-appearance.json 渲染成一张图鉴预览 PNG。"""
import json
from PIL import Image, ImageDraw

with open('shared/character-appearance.json', encoding='utf-8') as f:
    appr = json.load(f)
with open('shared/characters.json', encoding='utf-8') as f:
    chars = json.load(f)

SCALE = 6
PW, PH = 32, 44
CW, CH = PW * SCALE, PH * SCALE
GAP, PAD = 16, 20
COLS = 6
ROWS = (len(chars) + COLS - 1) // COLS
W = PAD * 2 + COLS * CW + (COLS - 1) * GAP
H = PAD * 2 + ROWS * CH + (ROWS - 1) * GAP

img = Image.new('RGB', (W, H), (0x11, 0x1e, 0x25))
draw = ImageDraw.Draw(img)


def hexrgb(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


for idx, c in enumerate(chars):
    s = appr[c['id']]
    cx = PAD + (idx % COLS) * (CW + GAP)
    cy = PAD + (idx // COLS) * (CH + GAP)
    for y, row in enumerate(s['rows']):
        for x, ch in enumerate(row):
            if ch == '.':
                continue
            draw.rectangle([cx + x * SCALE, cy + y * SCALE,
                            cx + (x + 1) * SCALE - 1, cy + (y + 1) * SCALE - 1],
                           fill=hexrgb(s['palette'][ch]))

img.save('docs/character-roster-preview.png')
print('预览图:', W, 'x', H, ' 角色数:', len(chars))
