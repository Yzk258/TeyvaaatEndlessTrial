#!/usr/bin/env python3
"""Generate refined pixel-art landmark sprites for the battle map (2x resolution, outlined, shaded)."""
from PIL import Image
import os, math

OUT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'landmarks')
os.makedirs(OUT, exist_ok=True)

def img(w, h):
    return Image.new('RGBA', (w, h), (0, 0, 0, 0))

def px(im, x, y, c):
    if 0 <= x < im.width and 0 <= y < im.height:
        im.putpixel((x, y), c)

def rect(im, x0, y0, x1, y1, c):
    for y in range(y0, y1):
        for x in range(x0, x1):
            px(im, x, y, c)

def ellipse(im, cx, cy, rx, ry, c):
    for y in range(int(cy - ry), int(cy + ry) + 1):
        for x in range(int(cx - rx), int(cx + rx) + 1):
            if ((x - cx) / max(rx, .1)) ** 2 + ((y - cy) / max(ry, .1)) ** 2 <= 1:
                px(im, x, y, c)

def line(im, x0, y0, x1, y1, c):
    dx = abs(x1 - x0); dy = -abs(y1 - y0)
    sx = 1 if x0 < x1 else -1; sy = 1 if y0 < y1 else -1
    err = dx + dy
    while True:
        px(im, x0, y0, c)
        if x0 == x1 and y0 == y1: break
        e2 = 2 * err
        if e2 >= dy: err += dy; x0 += sx
        if e2 <= dx: err += dx; y0 += sy

def darken(c, f):
    a = c[3] if len(c) > 3 else 255
    return tuple(max(0, min(255, int(ch * f))) for ch in c[:3]) + (a,)

def lighten(c, f):
    a = c[3] if len(c) > 3 else 255
    return tuple(min(255, int(ch + (255 - ch) * f)) for ch in c[:3]) + (a,)

def outline(im, factor=0.5, alpha_min=200):
    """Darken every opaque pixel bordering transparency — uniform pixel-art outline."""
    src = im.copy(); w, h = im.size
    for y in range(h):
        for x in range(w):
            p = src.getpixel((x, y))
            if p[3] < alpha_min:
                continue
            edge = False
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h or src.getpixel((nx, ny))[3] < alpha_min:
                    edge = True; break
            if edge:
                im.putpixel((x, y), darken(p, factor))
    return im

# ---------- palette (4-5 steps per material) ----------
STONE_D = (94, 96, 88); STONE = (134, 138, 124); STONE_L = (172, 176, 158); STONE_HL = (212, 216, 196)
MOSS_D = (60, 88, 52); MOSS = (90, 124, 78); MOSS_L = (124, 158, 104)
WOOD_D = (92, 66, 42); WOOD = (128, 94, 60); WOOD_L = (160, 124, 82); WOOD_HL = (198, 162, 116)
PLASTER_D = (186, 174, 146); PLASTER = (224, 214, 190); PLASTER_L = (242, 234, 214); PLASTER_HL = (253, 248, 234)
ROOF_D = (70, 52, 36); ROOF = (104, 78, 54); ROOF_L = (140, 108, 76)
BLADE_D = (194, 186, 166); BLADE = (236, 230, 216); BLADE_L = (251, 247, 238)
HIDE_D = (108, 80, 48); HIDE = (150, 116, 74); HIDE_L = (186, 150, 102); HIDE_HL = (212, 178, 128)
FIRE_D = (178, 68, 28); FIRE = (238, 148, 60); FIRE_L = (252, 214, 122)
WATER_D = (36, 78, 114); WATER = (60, 118, 164); WATER_L = (96, 162, 210); WATER_HL = (168, 216, 242)
SAND_D = (154, 142, 106); SAND = (186, 172, 130); SAND_L = (212, 200, 160)
STEEL_D = (52, 66, 88); STEEL = (110, 128, 150); STEEL_L = (158, 174, 192)
GLOW = (110, 224, 255); GLOW_L = (222, 250, 255)
ORE_D = (78, 118, 198); ORE = (110, 160, 235); ORE_L = (170, 210, 250); ORE_HL = (236, 248, 255)
PUFF = (236, 240, 228); PUFF_HL = (255, 255, 250)
BONE = (226, 218, 196)
FLOWER = (226, 178, 200)
SHADOW = (20, 40, 32, 110)

def ground_shadow(im, cx, cy, rx):
    for f, c in ((1.0, (20, 40, 32, 90)), (0.66, (20, 40, 32, 110)), (0.4, (20, 40, 32, 130))):
        ellipse(im, cx, cy, rx * f, 3, c)

# ================= landmarks =================
def make_windmill():
    im = img(88, 128)
    ground_shadow(im, 44, 122, 20)
    # stone base
    rect(im, 34, 108, 54, 122, STONE_D); rect(im, 36, 104, 52, 122, STONE)
    rect(im, 36, 104, 38, 122, STONE_L); rect(im, 50, 104, 52, 122, STONE_D)
    for yy in (110, 116): rect(im, 36, yy, 52, yy + 1, STONE_D)
    # tower body
    rect(im, 37, 60, 51, 106, PLASTER)
    rect(im, 37, 60, 40, 106, PLASTER_L); rect(im, 48, 60, 51, 106, PLASTER_D)
    # timber frame (dark X braces)
    rect(im, 37, 60, 40, 106, WOOD); rect(im, 48, 60, 51, 106, WOOD)
    for yy in (70, 82, 94): rect(im, 37, yy, 51, yy + 2, PLASTER_D)
    line(im, 40, 62, 48, 70, WOOD_D); line(im, 48, 62, 40, 70, WOOD_D)
    line(im, 40, 84, 48, 92, WOOD_D); line(im, 48, 84, 40, 92, WOOD_D)
    # window + door
    rect(im, 41, 66, 47, 72, (120, 116, 96)); rect(im, 42, 67, 46, 71, (180, 200, 210))
    rect(im, 41, 88, 47, 106, WOOD_D)
    rect(im, 42, 89, 46, 105, (96, 70, 40))
    line(im, 44, 89, 44, 105, WOOD_D)
    # roof (cone)
    for i, w in enumerate(range(22, 0, -2)):
        rect(im, 44 - w // 2, 44 + i, 44 + w // 2, 45 + i, ROOF if (i % 3) else ROOF_L)
    rect(im, 33, 56, 55, 60, ROOF); rect(im, 33, 56, 55, 58, ROOF_L); rect(im, 33, 59, 55, 60, ROOF_D)
    px(im, 44, 44, ROOF_D)
    # blades (hub at 44,30)
    hx, hy = 44, 30
    for (a, b) in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        line(im, hx, hy, hx + a * 30, hy + b * 30, WOOD_D)
    # sails (diamond-shaped canvases, lit top-right)
    def sail(cx, cy, flip):
        for dy in range(-10, 11):
            for dx in range(-6, 7):
                if abs(dx) + abs(dy) <= 10:
                    x, y = cx + dx, cy + dy
                    lit = (dx + dy) > 0 if not flip else (dx + dy) < 0
                    c = BLADE_L if lit and (abs(dx) < 3 or abs(dy) < 3) else (BLADE if lit else BLADE_D)
                    px(im, x, y, c)
    sail(hx, hy - 20, False); sail(hx, hy + 20, True); sail(hx + 20, hy, False); sail(hx - 20, hy, True)
    # hub cap
    rect(im, hx - 3, hy - 3, hx + 4, hy + 4, WOOD_D); rect(im, hx - 1, hy - 1, hx + 2, hy + 2, WOOD_HL)
    return outline(im)

def make_ruin():
    im = img(96, 80)
    ground_shadow(im, 48, 74, 26)
    # fallen slab (front)
    rect(im, 60, 64, 92, 76, STONE_D); rect(im, 62, 62, 90, 72, STONE)
    rect(im, 62, 62, 90, 65, STONE_L); rect(im, 62, 70, 90, 72, STONE_D)
    line(im, 66, 62, 88, 68, STONE_D)
    # main broken pillar
    rect(im, 28, 20, 52, 72, STONE)
    rect(im, 28, 20, 33, 72, STONE_L); rect(im, 47, 20, 52, 72, STONE_D)
    # jagged broken top
    rect(im, 30, 16, 40, 20, STONE); rect(im, 30, 14, 35, 16, STONE_L)
    rect(im, 42, 18, 50, 20, STONE); px(im, 47, 17, STONE_D)
    # fluting (vertical grooves)
    for gx in (36, 40, 44):
        rect(im, gx, 20, gx + 1, 70, STONE_D)
        px(im, gx, 21, STONE_L)
    # capital remnant to the right
    rect(im, 56, 44, 72, 60, STONE); rect(im, 56, 42, 68, 44, STONE_L); rect(im, 70, 44, 72, 60, STONE_D)
    rect(im, 57, 47, 71, 48, STONE_D); rect(im, 57, 54, 71, 55, STONE_D)
    # rubble mound
    for cx, cy, rr in [(16, 68, 6), (22, 70, 5), (76, 70, 7), (82, 72, 6), (10, 72, 5)]:
        ellipse(im, cx, cy, rr, rr - 2, STONE_D); ellipse(im, cx - 1, cy - 1, rr - 1, rr - 3, STONE); px(im, cx - 2, cy - 2, STONE_L)
    # moss growth
    for x, y in [(28, 22), (29, 23), (30, 24), (51, 30), (50, 31), (28, 55), (52, 66), (62, 63), (72, 46), (18, 66)]:
        px(im, x, y, MOSS); px(im, x + 1, y + 1, MOSS_D)
    px(im, 34, 18, MOSS_L)
    # vine
    line(im, 33, 20, 31, 40, MOSS_D); line(im, 31, 40, 34, 48, MOSS)
    px(im, 32, 44, MOSS_L)
    return outline(im)

def make_camp():
    im = img(116, 84)
    ground_shadow(im, 58, 78, 34)
    ellipse(im, 30, 68, 14, 4, (60, 48, 36, 150))  # burnt earth
    # big hide tent (left)
    for i, w in enumerate(range(44, 0, -4)):
        rect(im, 40 - w // 2, 20 + i, 40 + w // 2, 21 + i, HIDE if i % 2 else HIDE_L)
    rect(im, 16, 34, 64, 70, HIDE)
    rect(im, 16, 34, 22, 70, HIDE_D); rect(im, 58, 34, 64, 70, HIDE_D)
    # stitching
    for yy in (40, 50, 60): rect(im, 24, yy, 56, yy + 1, HIDE_D)
    # entrance (dark)
    for i, w in enumerate(range(16, 0, -4)):
        rect(im, 40 - w // 2, 48 + i, 40 + w // 2, 49 + i, (30, 22, 16))
    # fur trim + patches
    rect(im, 20, 34, 26, 70, HIDE_HL); rect(im, 54, 34, 60, 70, HIDE_HL)
    rect(im, 30, 38, 36, 42, HIDE_L); rect(im, 44, 56, 50, 60, HIDE_D)
    # support pole + skull totem
    rect(im, 38, 14, 42, 40, WOOD); px(im, 39, 14, WOOD_HL)
    px(im, 40, 22, BONE); px(im, 41, 22, BONE); px(im, 42, 22, BONE)
    px(im, 40, 23, (40, 30, 22)); px(im, 41, 23, (40, 30, 22)); px(im, 42, 23, (40, 30, 22))
    px(im, 41, 24, BONE); px(im, 40, 24, (40, 30, 22)); px(im, 42, 24, (40, 30, 22))
    # campfire (right)
    ellipse(im, 88, 64, 12, 4, (52, 42, 32, 200))
    for x, y, c in [(78, 62, STONE_D), (82, 66, STONE), (88, 68, STONE_L), (96, 66, STONE), (100, 62, STONE_D), (81, 56, STONE)]:
        px(im, x, y, c); px(im, x + 1, y, c)
    for i in range(10): line(im, 84 + i, 60 + i // 3, 84 + i, 60 + i // 3, WOOD_D)
    ellipse(im, 88, 54, 6, 9, FIRE_D); ellipse(im, 88, 52, 4, 6, FIRE); ellipse(im, 88, 52, 2, 3, FIRE_L)
    px(im, 86, 46, FIRE); px(im, 90, 47, FIRE_D); px(im, 88, 44, FIRE_L)
    # cooking spit
    rect(im, 74, 40, 76, 52, WOOD_D); rect(im, 102, 40, 104, 52, WOOD_D); rect(im, 74, 40, 104, 42, WOOD)
    # stakes
    for sx in (68, 110, 72, 106):
        rect(im, sx, 52, sx + 2, 70, WOOD_D); px(im, sx, 51, WOOD_D)
    return outline(im)

def make_pond():
    im = img(92, 60)
    ellipse(im, 46, 30, 42, 26, SAND_D)
    ellipse(im, 46, 30, 40, 24, SAND)
    ellipse(im, 45, 29, 34, 19, WATER_D)
    ellipse(im, 45, 29, 31, 17, WATER)
    ellipse(im, 44, 28, 20, 11, WATER_L)
    # shore pebbles
    for x, y in [(16, 20), (76, 22), (70, 40), (24, 40), (40, 44), (56, 44)]:
        px(im, x, y, STONE_D); px(im, x + 1, y, STONE)
    # shimmer
    for x, y in [(30, 22), (31, 22), (32, 23), (54, 34), (55, 34), (40, 38), (41, 38), (50, 20), (38, 26)]:
        px(im, x, y, WATER_HL)
    # lily pads + flower
    ellipse(im, 32, 28, 7, 3, MOSS_D); ellipse(im, 32, 28, 5, 2, MOSS); px(im, 32, 27, MOSS_L)
    ellipse(im, 31, 27, 2, 1, FLOWER); ellipse(im, 33, 27, 2, 1, FLOWER); px(im, 32, 26, (250, 220, 230))
    ellipse(im, 58, 33, 5, 2, MOSS_D); ellipse(im, 58, 33, 3, 1, MOSS)
    ellipse(im, 46, 38, 4, 2, MOSS_D); ellipse(im, 46, 38, 2, 1, MOSS)
    # reeds (right)
    for rx, rh in ((78, 16), (82, 20), (85, 14)):
        line(im, rx, 30, rx, 30 - rh, MOSS_D); px(im, rx, 30 - rh, (140, 120, 80)); px(im, rx, 30 - rh - 2, (150, 130, 90))
    line(im, 80, 30, 80, 28 - 14, MOSS)
    # dragonfly
    px(im, 60, 20, (180, 210, 240)); px(im, 59, 19, (220, 240, 250)); px(im, 61, 19, (220, 240, 250))
    return outline(im, alpha_min=220)

def make_waypoint():
    im = img(72, 104)
    # glow under
    for f, c in ((1.0, (110, 224, 255, 40)), (0.6, (110, 224, 255, 80))):
        ellipse(im, 36, 96, 16 * f, 4, c)
    # shaft
    rect(im, 32, 44, 40, 66, STEEL_D); rect(im, 33, 44, 39, 66, STEEL); rect(im, 33, 44, 35, 66, STEEL_L)
    # blade fins
    for i in range(10):
        px(im, 32 - i, 62 + i, STEEL_D); px(im, 40 + i, 62 + i, STEEL_D)
        px(im, 32 - i, 63 + i, STEEL)
    rect(im, 28, 72, 44, 80, STEEL_D); rect(im, 30, 72, 42, 84, STEEL); rect(im, 30, 72, 42, 74, STEEL_L)
    # anchor ring (floating)
    for a in range(0, 360, 2):
        x = 36 + 16 * math.cos(math.radians(a)); y = 22 + 16 * math.sin(math.radians(a))
        px(im, int(round(x)), int(round(y)), STEEL_D)
    for a in range(0, 360, 3):
        x = 36 + 13 * math.cos(math.radians(a)); y = 22 + 13 * math.sin(math.radians(a))
        px(im, int(round(x)), int(round(y)), STEEL)
    for a in range(0, 360, 8):
        x = 36 + 11 * math.cos(math.radians(a)); y = 22 + 11 * math.sin(math.radians(a))
        px(im, int(round(x)), int(round(y)), STEEL_L)
    # ring arcs (upper lit)
    for a in range(200, 340, 3):
        x = 36 + 16 * math.cos(math.radians(a)); y = 22 + 16 * math.sin(math.radians(a))
        px(im, int(round(x)), int(round(y)), STEEL_L)
    # glowing core
    ellipse(im, 36, 22, 9, 9, (40, 140, 180, 200)); ellipse(im, 36, 22, 6, 6, GLOW)
    ellipse(im, 36, 22, 3, 3, GLOW_L); ellipse(im, 35, 21, 1, 1, (255, 255, 255))
    # sparkles
    for x, y in [(26, 12), (48, 10), (50, 30), (24, 30)]:
        px(im, x, y, GLOW); px(im, x, y - 1, GLOW_L)
    # ground glow spots
    px(im, 30, 88, GLOW); px(im, 42, 90, GLOW); px(im, 36, 92, GLOW)
    return outline(im, alpha_min=220)

def make_tower():
    im = img(92, 128)
    ground_shadow(im, 46, 122, 22)
    # legs (slanted inward)
    for i in range(40):
        line(im, 16 + i // 4, 86 + i, 16 + i // 4, 86 + i, WOOD_D)
        line(im, 76 - i // 4, 86 + i, 76 - i // 4, 86 + i, WOOD_D)
        px(im, 17 + i // 4, 86 + i, WOOD); px(im, 77 - i // 4, 86 + i, WOOD)
    # cross braces
    for i in range(24):
        line(im, 22 + i, 98 + i // 2, 22 + i, 98 + i // 2, WOOD_D)
        line(im, 70 - i, 98 + i // 2, 70 - i, 98 + i // 2, WOOD_D)
    # ladder
    rect(im, 42, 92, 45, 122, WOOD_D); rect(im, 48, 92, 51, 122, WOOD_D)
    for yy in range(96, 122, 4): rect(im, 42, yy, 51, yy + 1, WOOD_L)
    # platform
    rect(im, 10, 78, 82, 92, WOOD); rect(im, 10, 78, 82, 82, WOOD_HL); rect(im, 12, 88, 80, 92, WOOD_D)
    rect(im, 12, 82, 13, 92, WOOD_D); rect(im, 79, 82, 80, 92, WOOD_D)
    # railing posts + rails
    for sx in (14, 24, 34, 44, 54, 64, 74):
        rect(im, sx, 70, sx + 2, 82, WOOD_D)
    rect(im, 14, 70, 78, 73, WOOD); rect(im, 14, 76, 78, 79, WOOD)
    # hut (hide roof)
    for i, w in enumerate(range(52, 0, -4)):
        rect(im, 46 - w // 2, 40 + i, 46 + w // 2, 41 + i, HIDE if i % 2 else HIDE_D)
    rect(im, 28, 52, 64, 70, HIDE)
    rect(im, 28, 52, 32, 70, HIDE_D); rect(im, 60, 52, 64, 70, HIDE_D)
    # entrance slit
    rect(im, 43, 60, 49, 70, (30, 22, 16))
    # skull + bones
    px(im, 46, 56, BONE); px(im, 47, 56, BONE); px(im, 46, 57, (40, 30, 22)); px(im, 47, 57, (40, 30, 22))
    # flag
    rect(im, 45, 20, 47, 44, WOOD_D); px(im, 46, 20, WOOD_HL)
    for xx in range(48, 66):
        yy = 24 + (xx - 48) // 4
        px(im, xx, yy, FIRE_D); px(im, xx, yy + 1, FIRE); px(im, xx, yy + 2, FIRE_D)
    # ropes to ground
    line(im, 30, 70, 26, 86, WOOD_D); line(im, 62, 70, 66, 86, WOOD_D)
    return outline(im)

def make_statue():
    im = img(80, 128)
    ground_shadow(im, 40, 122, 20)
    # pedestal (stepped)
    rect(im, 16, 104, 64, 120, STONE_D); rect(im, 18, 102, 62, 118, STONE)
    rect(im, 18, 102, 20, 118, STONE_L); rect(im, 60, 102, 62, 118, STONE_D)
    rect(im, 22, 96, 58, 104, STONE_D); rect(im, 24, 94, 56, 102, STONE); rect(im, 24, 94, 26, 102, STONE_L)
    rect(im, 26, 90, 54, 96, STONE_D); rect(im, 28, 88, 52, 94, STONE); rect(im, 28, 88, 30, 94, STONE_L)
    # robe (cone)
    for i, w in enumerate(range(24, 0, -2)):
        rect(im, 40 - w // 2, 70 + i, 40 + w // 2, 71 + i, STONE if i % 2 else STONE_L)
    rect(im, 30, 58, 50, 74, STONE)
    rect(im, 30, 58, 33, 74, STONE_L); rect(im, 47, 58, 50, 74, STONE_D)
    # belt + fold lines
    rect(im, 32, 66, 48, 68, STONE_D)
    for yy in (60, 72): line(im, 34, yy, 46, yy, STONE_D)
    # arms (praying)
    rect(im, 34, 50, 38, 60, STONE); rect(im, 42, 50, 46, 60, STONE)
    # head + halo
    ellipse(im, 40, 44, 6, 6, STONE_L); ellipse(im, 39, 43, 2, 2, STONE_HL)
    for a in range(0, 360, 12):
        x = 40 + 11 * math.cos(math.radians(a)); y = 40 + 4 * math.sin(math.radians(a))
        px(im, int(round(x)), int(round(y)), (214, 200, 130))
    # wings
    for i in range(18):
        px(im, 26 - (i * 3) // 4, 46 - i, STONE if i % 2 else STONE_L)
        px(im, 25 - (i * 3) // 4, 46 - i, STONE_D)
        px(im, 54 + (i * 3) // 4, 46 - i, STONE if i % 2 else STONE_L)
        px(im, 55 + (i * 3) // 4, 46 - i, STONE_D)
    for i in range(10):
        px(im, 18 - i // 2, 30 - i, STONE_L); px(im, 62 + i // 2, 30 - i, STONE_D)
    # moss
    for x, y in [(20, 116), (22, 117), (58, 110), (34, 90), (46, 74), (30, 102)]:
        px(im, x, y, MOSS); px(im, x + 1, y, MOSS_D)
    return outline(im)

def make_lantern():
    im = img(40, 56)
    ground_shadow(im, 20, 50, 10)
    rect(im, 16, 42, 24, 50, STONE_D); rect(im, 17, 40, 23, 50, STONE); rect(im, 17, 40, 18, 50, STONE_L)
    rect(im, 10, 50, 30, 52, STONE_D); rect(im, 12, 48, 28, 50, STONE)
    # light box
    rect(im, 12, 24, 28, 40, STONE); rect(im, 12, 24, 14, 40, STONE_D); rect(im, 26, 24, 28, 40, STONE_D)
    rect(im, 14, 26, 26, 38, (250, 200, 96)); rect(im, 15, 27, 25, 37, (252, 214, 122))
    # lantern ribs
    for lx in (17, 20, 23): rect(im, lx, 26, lx + 1, 38, STONE_D)
    # roof
    rect(im, 10, 18, 30, 24, STONE_D); rect(im, 11, 16, 29, 22, STONE); rect(im, 11, 16, 13, 22, STONE_L)
    for i, w in enumerate(range(10, 0, -2)):
        rect(im, 20 - w // 2, 12 + i, 20 + w // 2, 13 + i, STONE if i % 2 else STONE_L)
    px(im, 20, 10, STONE_D)
    # glow spill
    px(im, 14, 25, GLOW); px(im, 27, 25, GLOW); px(im, 14, 39, GLOW); px(im, 27, 39, GLOW)
    px(im, 20, 46, (250, 214, 122, 180))
    px(im, 12, 26, MOSS); px(im, 13, 26, MOSS_D)
    return outline(im, alpha_min=220)

def make_signpost():
    im = img(36, 60)
    ground_shadow(im, 18, 56, 9)
    rect(im, 16, 16, 20, 54, WOOD); rect(im, 16, 16, 17, 54, WOOD_L); rect(im, 19, 16, 20, 54, WOOD_D)
    rect(im, 16, 52, 21, 54, WOOD_D)
    # top board (right-pointing)
    rect(im, 4, 20, 28, 28, WOOD_L); rect(im, 4, 20, 6, 28, WOOD_D)
    px(im, 28, 21, WOOD_L); px(im, 29, 22, WOOD_L); px(im, 30, 23, WOOD_L); px(im, 31, 24, WOOD_L)
    px(im, 28, 24, WOOD_L); px(im, 29, 25, WOOD_L); px(im, 30, 26, WOOD_L); px(im, 31, 27, WOOD_L)
    # bottom board (left-pointing)
    rect(im, 8, 36, 32, 44, WOOD); rect(im, 30, 36, 32, 44, WOOD_D)
    px(im, 7, 37, WOOD); px(im, 6, 38, WOOD); px(im, 5, 39, WOOD); px(im, 4, 40, WOOD)
    px(im, 7, 42, WOOD); px(im, 6, 43, WOOD); px(im, 5, 44, WOOD); px(im, 4, 45, WOOD)
    # nails + grain
    px(im, 10, 24, WOOD_D); px(im, 12, 40, WOOD_D); px(im, 17, 22, WOOD_D); px(im, 18, 30, WOOD_D)
    px(im, 17, 46, WOOD_D)
    return outline(im)

def make_crate():
    im = img(40, 40)
    ground_shadow(im, 20, 36, 13)
    rect(im, 4, 6, 36, 32, WOOD); rect(im, 4, 6, 36, 9, WOOD_L); rect(im, 6, 29, 34, 32, WOOD_D)
    rect(im, 4, 6, 7, 32, WOOD_D); rect(im, 33, 6, 36, 32, WOOD_D)
    # frame planks
    rect(im, 8, 8, 12, 30, WOOD_D); rect(im, 28, 8, 32, 30, WOOD_D)
    # X cross
    line(im, 12, 8, 28, 30, WOOD_L); line(im, 28, 8, 12, 30, WOOD_L)
    line(im, 11, 8, 27, 30, WOOD_HL); line(im, 27, 8, 11, 30, WOOD_D)
    # nails
    px(im, 8, 9, WOOD_D); px(im, 31, 9, WOOD_D); px(im, 8, 29, WOOD_D); px(im, 31, 29, WOOD_D)
    px(im, 12, 8, (90, 70, 45)); px(im, 28, 8, (90, 70, 45))
    return outline(im)

def make_barrel():
    im = img(32, 40)
    ground_shadow(im, 16, 36, 10)
    # bulged body (barrel profile)
    for yy in range(6, 34):
        w = 6 + (6 - abs(yy - 20)) // 2
        w = max(5, min(10, w))
        if yy < 9: w = 7
        if yy > 30: w = 7
        rect(im, 16 - w, yy, 16 + w, yy + 1, WOOD)
        px(im, 16 - w, yy, WOOD_L); px(im, 16 + w - 1, yy, WOOD_D)
    # vertical staves
    for sx in (12, 16, 20):
        rect(im, sx, 8, sx + 1, 33, WOOD_D)
    # top + bottom
    rect(im, 9, 6, 23, 9, WOOD_L); rect(im, 11, 6, 21, 7, WOOD_HL)
    rect(im, 9, 31, 23, 34, WOOD_D)
    # metal hoops
    for yy in (14, 20, 26):
        for xx in range(7, 25):
            px(im, xx, yy, STEEL_D)
        px(im, 8, yy, STEEL); px(im, 16, yy, STEEL); px(im, 22, yy, STEEL_L)
    return outline(im)

def make_campfire():
    im = img(48, 48)
    ground_shadow(im, 24, 42, 16)
    ellipse(im, 24, 40, 13, 4, (52, 42, 32, 200))
    # stone ring
    for x, y, c in [(10, 38, STONE_D), (14, 42, STONE), (24, 44, STONE_L), (34, 42, STONE), (38, 38, STONE_D), (12, 32, STONE), (36, 32, STONE_D), (24, 45, STONE_HL)]:
        px(im, x, y, c); px(im, x + 1, y, c)
    # logs (crisscross)
    for i in range(16):
        line(im, 16 + i, 34 + i // 4, 16 + i, 34 + i // 4, WOOD_D)
        line(im, 32 - i, 34 + i // 4, 32 - i, 34 + i // 4, WOOD)
    # kindling
    rect(im, 20, 34, 28, 36, (90, 60, 30))
    # flame (tall layered)
    ellipse(im, 24, 26, 7, 12, FIRE_D); ellipse(im, 24, 24, 5, 9, FIRE); ellipse(im, 24, 22, 3, 5, FIRE_L)
    px(im, 24, 18, FIRE_L); px(im, 22, 20, FIRE_L); px(im, 26, 21, FIRE_L)
    px(im, 20, 16, FIRE); px(im, 28, 18, FIRE); px(im, 24, 14, FIRE_D)
    # embers + smoke
    px(im, 20, 36, (120, 60, 20)); px(im, 28, 36, (120, 60, 20))
    px(im, 24, 12, (220, 220, 220, 120)); px(im, 25, 10, (200, 200, 200, 90))
    return outline(im, alpha_min=220)

def make_dandelion():
    im = img(40, 28)
    stems = [(6, 4, 14), (14, 2, 10), (22, 6, 15), (30, 8, 16), (34, 10, 12), (10, 10, 12)]
    for sx, sy, ln in stems:
        for i in range(ln - 4):
            line(im, sx + i // 4, sy + 4 + i, sx + i // 4, sy + 4 + i, MOSS_D)
        px(im, sx, sy + ln - 3, MOSS)
    # white fluffy heads (radial puffs)
    for hx, hy in [(6, 3), (14, 1), (22, 5), (33, 9)]:
        for dx in range(-4, 5):
            for dy in range(-4, 5):
                d = dx * dx + dy * dy
                if d <= 14:
                    c = PUFF_HL if d <= 2 else PUFF
                    px(im, hx + dx, hy + dy, c)
        for k in range(8):
            a = k * 45
            px(im, hx + int(5 * math.cos(math.radians(a))), hy + int(5 * math.sin(math.radians(a))), (200, 210, 196, 220))
    # flying seeds
    for x, y in [(4, 14), (18, 12), (28, 16), (38, 14), (8, 16)]:
        px(im, x, y, PUFF); px(im, x + 1, y, (200, 210, 196, 200))
    # yellow buds
    px(im, 12, 11, (226, 200, 90)); px(im, 13, 11, (226, 200, 90)); px(im, 12, 12, MOSS_D)
    return outline(im, alpha_min=220)

def make_ore():
    im = img(56, 44)
    ground_shadow(im, 28, 40, 17)
    # rock base
    rect(im, 8, 26, 48, 40, STONE_D); rect(im, 12, 22, 44, 36, STONE)
    rect(im, 12, 22, 16, 36, STONE_L); rect(im, 40, 22, 44, 36, STONE_D)
    ellipse(im, 20, 32, 6, 4, STONE_L); ellipse(im, 38, 30, 5, 4, STONE_D)
    # crystals
    def crystal(cx, cy, ln, base, light):
        for i in range(ln):
            w = max(1, (ln - i) // 3)
            rect(im, cx - w, cy + i, cx + w + 1, cy + i + 1, base if (i % 3) else light)
        px(im, cx, cy, ORE_HL); px(im, cx - 1, cy + 1, ORE_L)
    crystal(16, 8, 15, ORE_D, ORE)
    crystal(28, 4, 19, ORE, ORE_L)
    crystal(40, 10, 13, ORE_D, ORE)
    crystal(22, 14, 10, ORE, ORE_L)
    # sparkles
    px(im, 28, 4, ORE_HL); px(im, 26, 8, (200, 230, 252)); px(im, 42, 12, (200, 230, 252))
    px(im, 14, 10, (180, 214, 248))
    px(im, 14, 24, MOSS_D); px(im, 44, 24, MOSS); px(im, 15, 25, MOSS)
    return outline(im)

def make_slabs():
    im = img(112, 48)
    tiles = [
        (4, 8, 28, 24, STONE), (32, 6, 60, 22, STONE_L), (64, 10, 92, 26, STONE),
        (12, 26, 40, 42, STONE_D), (44, 24, 76, 40, STONE), (80, 28, 108, 44, STONE_L),
        (24, 4, 48, 10, STONE_L), (72, 4, 100, 10, STONE_D),
    ]
    for x0, y0, x1, y1, c in tiles:
        rect(im, x0, y0, x1, y1, c)
        rect(im, x0, y0, x1, y0 + 2, lighten(c, .15) if c != STONE_D else STONE)
        rect(im, x0, y1 - 2, x1, y1, darken(c, .2) if c != STONE_D else darken(STONE_D, .3))
        px(im, x0 + 1, y0 + 3, lighten(c, .3))
        px(im, x1 - 3, y1 - 4, darken(c, .25))
    # cracks
    for (sx, sy, ex, ey) in [(30, 12, 34, 18), (40, 26, 46, 34), (70, 14, 66, 20), (90, 32, 96, 40)]:
        line(im, sx, sy, ex, ey, (60, 62, 54))
    # moss in gaps
    for x, y in [(29, 22), (28, 23), (62, 24), (63, 25), (78, 42), (10, 26), (42, 14), (94, 28)]:
        px(im, x, y, MOSS); px(im, x + 1, y + 1, MOSS_D)
    # grass tufts at edges
    for x in (6, 20, 50, 70, 100):
        px(im, x, 2, MOSS); px(im, x + 1, 3, MOSS_L)
        px(im, x, 46, MOSS); px(im, x - 1, 45, MOSS_D)
    return outline(im, alpha_min=220)

sprites = {
    'windmill': make_windmill(), 'ruin': make_ruin(), 'camp': make_camp(), 'pond': make_pond(),
    'waypoint': make_waypoint(), 'tower': make_tower(), 'statue': make_statue(), 'lantern': make_lantern(),
    'signpost': make_signpost(), 'crate': make_crate(), 'barrel': make_barrel(), 'campfire': make_campfire(),
    'dandelion': make_dandelion(), 'ore': make_ore(), 'slabs': make_slabs(),
}
for name, im in sprites.items():
    path = os.path.join(OUT, name + '.png')
    im.save(path)
    print('saved', path, im.size)
