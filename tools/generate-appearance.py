# -*- coding: utf-8 -*-
"""生成 shared/character-appearance.json 的精细像素立绘（32x44）。

绘制顺序：身体 → 脸(皮肤) → 头发/头饰(覆盖额头与鬓角) → 五官。
用法：
    python tools/generate-appearance.py --preview amber
    python tools/generate-appearance.py            # 生成完整 JSON
"""
import json
import sys

W, H = 32, 44


class Sprite:
    def __init__(self, name):
        self.name = name
        self.grid = [['.'] * W for _ in range(H)]
        self.pal = {}

    def set(self, x, y, ch):
        if 0 <= x < W and 0 <= y < H:
            self.grid[y][x] = ch

    def rect(self, x0, y0, x1, y1, ch):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, ch)

    def hline(self, x0, x1, y, ch):
        for x in range(x0, x1 + 1):
            self.set(x, y, ch)

    def vline(self, x, y0, y1, ch):
        for y in range(y0, y1 + 1):
            self.set(x, y, ch)

    def rows(self):
        return [''.join(r) for r in self.grid]


# 调色板键：s皮肤 l高光 e瞳/眉 w眼白 b腮红 m嘴 g阴影
#           h发主 H发暗 L发亮 c衣主 d衣暗 t领口 a点缀


def draw_body(s: Sprite, cloth, cloth_dark, trim, accent):
    s.rect(8, 29, 23, 31, cloth)
    s.hline(11, 20, 29, trim)
    s.hline(12, 19, 30, trim)
    s.rect(12, 31, 19, 31, 's')
    s.rect(7, 32, 24, 41, cloth)
    s.rect(7, 32, 24, 33, cloth_dark)
    s.vline(7, 34, 41, cloth_dark)
    s.vline(24, 34, 41, cloth_dark)
    s.rect(14, 34, 17, 39, accent)
    s.hline(13, 18, 42, cloth_dark)


def draw_face(s: Sprite, skin, shadow):
    s.rect(7, 9, 24, 22, skin)
    s.rect(9, 23, 22, 24, skin)
    s.rect(11, 25, 20, 26, skin)
    s.rect(12, 27, 19, 28, skin)
    # 脸侧与下巴阴影
    s.hline(7, 8, 21, shadow); s.hline(23, 24, 21, shadow)
    s.hline(7, 8, 22, shadow); s.hline(23, 24, 22, shadow)
    s.hline(9, 10, 25, shadow); s.hline(21, 22, 25, shadow)
    s.hline(11, 12, 26, shadow); s.hline(19, 20, 26, shadow)
    s.hline(13, 18, 28, shadow)


def draw_eyes(s: Sprite, eye, white, highlight):
    s.hline(11, 13, 13, eye)
    s.hline(18, 20, 13, eye)
    # 左眼 x10-13, y15-16
    s.set(10, 15, white); s.set(13, 15, white)
    s.set(10, 16, white); s.set(13, 16, white)
    s.set(11, 15, highlight); s.set(12, 15, eye)
    s.set(11, 16, eye); s.set(12, 16, eye)
    # 右眼 x18-21, y15-16
    s.set(18, 15, white); s.set(21, 15, white)
    s.set(18, 16, white); s.set(21, 16, white)
    s.set(19, 15, eye); s.set(20, 15, highlight)
    s.set(19, 16, eye); s.set(20, 16, eye)


def draw_mouth_blush(s: Sprite, blush, mouth):
    s.set(8, 17, blush); s.set(9, 17, blush)
    s.set(22, 17, blush); s.set(23, 17, blush)
    s.set(8, 18, blush); s.set(23, 18, blush)
    s.set(13, 19, mouth); s.set(18, 19, mouth)
    s.hline(13, 18, 20, mouth)


def prep(s: Sprite, cloth, cloth_dark, trim, accent, skin, shadow):
    draw_body(s, cloth, cloth_dark, trim, accent)
    draw_face(s, skin, shadow)


def finish(s: Sprite, eye, white, highlight, blush, mouth):
    draw_eyes(s, eye, white, highlight)
    draw_mouth_blush(s, blush, mouth)


# ---------------------------------------------------------------- 角色
def build_amber():
    s = Sprite('amber')
    s.pal = {
        's': '#f1c5a2', 'l': '#fff2d8', 'e': '#5a3a20', 'w': '#ffffff',
        'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
        'h': '#7a4a32', 'H': '#4a2a1e', 'L': '#a86840',
        'c': '#b8433e', 'd': '#743036', 't': '#e4c279', 'a': '#c65c45',
    }
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    # 头发
    s.rect(5, 3, 26, 8, 'h')
    s.hline(4, 27, 9, 'H')
    s.rect(4, 10, 6, 20, 'H')
    s.rect(25, 10, 27, 20, 'H')
    s.rect(4, 5, 6, 9, 'h')
    s.rect(25, 5, 27, 9, 'h')
    s.rect(5, 3, 6, 4, 'L')
    s.rect(25, 3, 26, 4, 'L')
    # 刘海（盖住额头到眉毛上方）
    s.hline(6, 25, 9, 'h')
    s.hline(7, 24, 10, 'h')
    s.hline(8, 23, 11, 'h')
    s.hline(9, 22, 12, 'h')
    s.hline(11, 13, 12, 'L'); s.hline(18, 20, 12, 'L')
    # 头顶蝴蝶结
    s.rect(13, 1, 18, 2, 'a')
    s.hline(14, 17, 3, 'a')
    s.rect(15, 2, 16, 3, 't')
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_barbara():
    s = Sprite('barbara')
    s.pal = {
        's': '#f1c5a2', 'l': '#fff2d8', 'e': '#3a6ab8', 'w': '#ffffff',
        'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
        'h': '#e7cc85', 'H': '#b89c61', 'L': '#f6e3a8',
        'c': '#e5e9e7', 'd': '#7097b7', 't': '#456e9b', 'a': '#f7f6e9',
    }
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    # 双马尾
    s.rect(3, 6, 6, 25, 'H')
    s.rect(25, 6, 28, 25, 'H')
    s.rect(3, 6, 4, 25, 'h')
    s.rect(27, 6, 28, 25, 'h')
    # 头顶
    s.rect(6, 2, 25, 8, 'h')
    s.hline(7, 24, 2, 'L')
    # 刘海
    s.hline(7, 24, 9, 'h')
    s.hline(8, 23, 10, 'h')
    s.hline(9, 22, 11, 'h')
    s.hline(10, 21, 12, 'h')
    # 蝴蝶结
    s.rect(4, 3, 6, 5, 'a')
    s.rect(25, 3, 27, 5, 'a')
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_lisa():
    s = Sprite('lisa')
    s.pal = {
        's': '#f1c5a2', 'l': '#fff2d8', 'e': '#4a8a5a', 'w': '#ffffff',
        'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
        'h': '#9c7953', 'H': '#6a503d', 'L': '#c09a70',
        'c': '#76538c', 'd': '#493858', 't': '#dac28a', 'a': '#ac87c2',
    }
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    # 大魔女帽
    s.rect(4, 1, 27, 3, 'H')
    s.rect(3, 2, 28, 3, 'h')
    s.rect(6, 4, 25, 5, 'H')
    s.rect(9, 6, 22, 6, 'h')
    s.rect(12, 7, 19, 7, 'H')
    s.rect(14, 8, 17, 8, 'h')
    s.rect(15, 9, 16, 10, 't')
    # 长发
    s.rect(5, 8, 7, 24, 'H')
    s.rect(24, 8, 26, 24, 'H')
    s.rect(5, 8, 6, 24, 'h')
    s.rect(25, 8, 26, 24, 'h')
    s.hline(9, 22, 12, 'h')
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_kaeya():
    s = Sprite('kaeya')
    s.pal = {
        's': '#d7ad8a', 'l': '#fff2d8', 'e': '#3a6ab8', 'w': '#ffffff',
        'b': '#c98f7a', 'm': '#8a4a4a', 'g': '#bd9372',
        'h': '#3f7398', 'H': '#253d60', 'L': '#5f9cc0',
        'c': '#edf0ee', 'd': '#344e75', 't': '#c4a56f', 'a': '#88c9dc',
    }
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    # 短发 + 左长刘海
    s.rect(5, 3, 26, 8, 'h')
    s.rect(5, 4, 7, 22, 'H')
    s.rect(25, 4, 26, 14, 'H')
    s.hline(8, 23, 11, 'h')
    s.hline(9, 22, 12, 'h')
    # 眼罩（遮左眼）
    s.rect(9, 14, 14, 16, 'H')
    s.set(14, 15, 't')
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


# ---------------------------------------------------------------- 发型辅助
def fringe(s):
    """标准刘海：盖住额头到眉毛上方，下缘带高光。"""
    s.hline(6, 25, 9, 'h')
    s.hline(7, 24, 10, 'h')
    s.hline(8, 23, 11, 'h')
    s.hline(9, 22, 12, 'h')
    s.hline(11, 13, 12, 'L')
    s.hline(18, 20, 12, 'L')


def top_hair(s):
    s.rect(5, 3, 26, 8, 'h')
    s.rect(5, 3, 6, 4, 'L')
    s.rect(25, 3, 26, 4, 'L')


def side_locks(s, y1=20):
    s.rect(4, 10, 6, y1, 'H')
    s.rect(25, 10, 27, y1, 'H')


def twin_tails(s):
    s.rect(3, 6, 6, 25, 'H')
    s.rect(25, 6, 28, 25, 'H')
    s.rect(3, 6, 4, 25, 'h')
    s.rect(27, 6, 28, 25, 'h')


def build_bennett():
    s = Sprite('bennett')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#4a8a5a', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#ece8dc', 'H': '#b0aca0', 'L': '#ffffff',
             'c': '#ece8e0', 'd': '#5a5a60', 't': '#c04030', 'a': '#a87848'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    top_hair(s)
    fringe(s)
    s.hline(8, 23, 9, 'a')            # 护目镜带（在刘海之上）
    s.set(11, 10, 'L'); s.set(12, 10, 'L')
    s.set(19, 10, 'L'); s.set(20, 10, 'L')
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_diluc():
    s = Sprite('diluc')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#b04040', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#c04040', 'H': '#7a2828', 'L': '#e06060',
             'c': '#3a3a42', 'd': '#1e1e24', 't': '#a03030', 'a': '#d08040'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(5, 3, 26, 8, 'h')
    s.rect(23, 1, 26, 6, 'h')        # 高马尾
    s.hline(24, 25, 0, 'H')
    s.rect(25, 0, 27, 4, 'H')
    fringe(s)
    side_locks(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_diona():
    s = Sprite('diona')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#4a80b0', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#e8b8c8', 'H': '#b87890', 'L': '#f4d0dc',
             'c': '#7ab89a', 'd': '#4a7a60', 't': '#f0d8e0', 'a': '#608a78'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    # 猫耳
    s.set(9, 1, 'H'); s.set(8, 2, 'H'); s.set(9, 2, 'H'); s.set(10, 2, 'H')
    s.set(22, 1, 'H'); s.set(21, 2, 'H'); s.set(22, 2, 'H'); s.set(23, 2, 'H')
    s.set(9, 2, 'h'); s.set(22, 2, 'h')
    s.rect(5, 3, 26, 8, 'h')
    fringe(s)
    side_locks(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_hu_tao():
    s = Sprite('hu-tao')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#b04040', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#6a4038', 'H': '#402828', 'L': '#8a5a48',
             'c': '#5a3038', 'd': '#302028', 't': '#c05050', 'a': '#8a3a40'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(7, 1, 24, 3, 'c')         # 红帽
    s.hline(8, 23, 0, 'c')
    s.set(15, 2, 't'); s.set(16, 2, 't')   # 梅花
    twin_tails(s)
    s.rect(5, 3, 26, 8, 'h')
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_klee():
    s = Sprite('klee')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#b04040', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#e8c878', 'H': '#a88038', 'L': '#f4dc9a',
             'c': '#c04838', 'd': '#802828', 't': '#f0ece0', 'a': '#e07848'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.set(15, 2, 'h'); s.set(16, 1, 'h'); s.set(16, 0, 'h')   # 呆毛
    s.rect(5, 3, 26, 8, 'h')
    s.rect(17, 1, 26, 3, 'c')        # 斜戴红帽
    s.hline(18, 26, 4, 'c')
    s.set(25, 0, 't'); s.set(26, 1, 't')   # 白羽
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_keqing():
    s = Sprite('keqing')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#7a50a8', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#b088d8', 'H': '#705090', 'L': '#d0b0f0',
             'c': '#6a80c8', 'd': '#3a4a78', 't': '#d8b458', 'a': '#8a6cc8'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(6, 2, 10, 4, 'H')         # 双髻
    s.rect(21, 2, 25, 4, 'H')
    s.rect(7, 2, 9, 4, 'h')
    s.rect(22, 2, 24, 4, 'h')
    s.rect(5, 3, 26, 8, 'h')
    fringe(s)
    side_locks(s, 20)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_mona():
    s = Sprite('mona')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#4060a0', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#4a3860', 'H': '#2a2038', 'L': '#6a5890',
             'c': '#4060a0', 'd': '#243058', 't': '#d8b858', 'a': '#7058a0'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(4, 2, 27, 3, 'H')         # 大占星帽：宽檐
    s.rect(8, 4, 23, 4, 'h')         # 帽身
    s.rect(11, 5, 20, 5, 'H')
    s.rect(14, 6, 17, 6, 'h')
    s.rect(15, 7, 16, 8, 'H')        # 帽尖
    s.set(15, 6, 't'); s.set(16, 6, 't')   # 金星
    s.rect(5, 8, 7, 24, 'H')         # 长发
    s.rect(24, 8, 26, 24, 'H')
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_ningguang():
    s = Sprite('ningguang')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#b04040', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#e8e0c8', 'H': '#b0a080', 'L': '#f6f0da',
             'c': '#d8b868', 'd': '#907838', 't': '#f0ead8', 'a': '#c0a058'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(11, 1, 20, 3, 'H')        # 发髻
    s.hline(12, 19, 0, 'H')
    s.rect(12, 1, 19, 2, 'h')
    s.set(11, 2, 't'); s.set(20, 2, 't')   # 发簪
    s.rect(5, 3, 26, 8, 'h')
    fringe(s)
    side_locks(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_qiqi():
    s = Sprite('qiqi')
    s.pal = {'s': '#e8ddd0', 'l': '#fff2d8', 'e': '#b06070', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d0c5b8',
             'h': '#c8d8e8', 'H': '#8898a8', 'L': '#e8eef4',
             'c': '#e0e4e8', 'd': '#8090b8', 't': '#d8c878', 'a': '#a0b0c8'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(13, 1, 18, 2, 't')        # 符咒
    s.hline(14, 17, 0, 't')
    s.hline(14, 17, 3, 't')
    s.rect(5, 3, 26, 8, 'h')
    s.rect(5, 3, 6, 4, 'L')
    s.rect(25, 3, 26, 4, 'L')
    fringe(s)
    side_locks(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_jean():
    s = Sprite('jean')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#4068a8', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#e0c078', 'H': '#a07838', 'L': '#f0d89a',
             'c': '#e8e6e0', 'd': '#6080b0', 't': '#a8b8d0', 'a': '#c8b088'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(5, 3, 26, 8, 'h')
    s.rect(24, 1, 27, 5, 'H')        # 高马尾
    s.hline(25, 27, 0, 'H')
    fringe(s)
    side_locks(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_venti():
    s = Sprite('venti')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#3a8a6a', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#58b89a', 'H': '#387868', 'L': '#80d8b8',
             'c': '#60a878', 'd': '#387858', 't': '#e8ece0', 'a': '#90d0a8'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(8, 1, 23, 3, 'H')         # 绿帽
    s.hline(9, 22, 0, 'H')
    s.set(22, 0, 't'); s.set(23, 1, 't')   # 羽毛
    s.rect(3, 6, 5, 25, 'H')         # 双辫
    s.rect(26, 6, 28, 25, 'H')
    s.rect(3, 6, 4, 25, 'h')
    s.rect(25, 6, 28, 25, 'h')
    s.rect(5, 3, 26, 8, 'h')
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_xiangling():
    s = Sprite('xiangling')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#8a5a20', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#404878', 'H': '#282838', 'L': '#6068a0',
             'c': '#e06838', 'd': '#903828', 't': '#f0e8d0', 'a': '#f09058'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    twin_tails(s)
    s.rect(5, 3, 26, 8, 'h')
    s.set(12, 2, 'a'); s.set(19, 2, 'a')
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_xingqiu():
    s = Sprite('xingqiu')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#4068a8', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#4068a8', 'H': '#283868', 'L': '#6090d0',
             'c': '#5078b8', 'd': '#283860', 't': '#e0e8f0', 'a': '#d0a858'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    top_hair(s)
    fringe(s)
    side_locks(s, 20)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


def build_zhongli():
    s = Sprite('zhongli')
    s.pal = {'s': '#f1c5a2', 'l': '#fff2d8', 'e': '#b08030', 'w': '#ffffff',
             'b': '#dc9290', 'm': '#8a4a4a', 'g': '#d9a887',
             'h': '#7a5038', 'H': '#4a3028', 'L': '#a87850',
             'c': '#8a6048', 'd': '#503828', 't': '#d8b458', 'a': '#c09850'}
    prep(s, 'c', 'd', 't', 'a', 's', 'g')
    s.rect(5, 3, 26, 8, 'h')
    s.rect(11, 1, 20, 2, 'H')        # 束发
    s.hline(12, 19, 0, 'H')
    s.hline(11, 20, 2, 't')          # 金冠
    s.rect(4, 10, 6, 22, 'H')        # 后垂长发
    s.rect(25, 10, 27, 22, 'H')
    s.rect(4, 10, 5, 22, 'h')
    s.rect(26, 10, 27, 22, 'h')
    fringe(s)
    finish(s, 'e', 'w', 'l', 'b', 'm')
    return s


BUILDERS = {
    'amber': build_amber,
    'barbara': build_barbara,
    'lisa': build_lisa,
    'kaeya': build_kaeya,
    'bennett': build_bennett,
    'diluc': build_diluc,
    'diona': build_diona,
    'hu-tao': build_hu_tao,
    'klee': build_klee,
    'keqing': build_keqing,
    'mona': build_mona,
    'ningguang': build_ningguang,
    'qiqi': build_qiqi,
    'jean': build_jean,
    'venti': build_venti,
    'xiangling': build_xiangling,
    'xingqiu': build_xingqiu,
    'zhongli': build_zhongli,
}


def ascii_preview(name):
    s = BUILDERS[name]()
    legend = {'.': ' ', 's': '#', 'l': '@', 'e': 'O', 'w': 'o', 'b': '%',
              'm': ',', 'g': '=', 'h': 'H', 'H': 'h', 'L': '^',
              'c': 'C', 'd': 'D', 't': 'T', 'a': 'A'}
    print('==', name, '==')
    for r in s.rows():
        print(''.join(legend.get(ch, '?') for ch in r))


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == '--preview':
        for nm in sys.argv[2:]:
            ascii_preview(nm)
    else:
        out = {}
        for name, fn in BUILDERS.items():
            s = fn()
            out[name] = {'width': W, 'height': H, 'palette': s.pal, 'rows': s.rows()}
        with open('shared/character-appearance.json', 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        print('生成完成:', len(out), '个角色')
