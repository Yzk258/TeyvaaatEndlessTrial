# 素材待办

开场背景已使用内置图像生成工具，按用户参考截图制作像素版中央蓝门与云海场景，保存至frontend/public/backgrounds/sky-gate-pixel-v2.png，界面按钮由代码独立叠加。提示词及使用位置见LOGIN-BACKGROUND.md。

## 敌怪像素形象

战场采用按用户原图绘制的八种透明像素形象。每种敌怪按类型绑定图集位置，生命、伤害、经验和攻击方式由独立的战斗配置定义。射手丘丘人、岩丘丘萨满和火深渊法师分别发射弩箭、岩弹和火球。丘丘岩盔王在无尽模式每第十波以精英身份登场。

图集位于 `frontend/public/enemies/`，由 `shared/enemy-appearance.json` 配置。战场通过 SVG 符号复用图集裁切，史莱姆保留起伏，敌怪受击时仍闪白和抖动。[敌怪预览](assets/enemies-preview.png)

火深渊法师使用独立的 `pyro-abyss-mage-v2.png`。修订版补出了袍摆下的两只脚，原 B 图集仍供其他敌怪裁切。

### 图集与提示词

#### 火深渊法师修订

用内置 imagegen 参考旧图集左下角和 `深渊丘丘.webp` 修订。

```text
Create a corrected standalone transparent battle pixel sprite of ONLY the Pyro Abyss Mage (火深渊法师) shown in the LOWER LEFT quadrant of the first supplied sprite atlas. The second image is the original in-game model for anatomical reference. Keep the first mage's recognizable front-facing chibi silhouette, thick square stepped pixels, crimson shaggy mantle and twin hood tufts, black featureless face with exactly two yellow eyes, dark maroon and cream-gold robe, and the upright orange flame staff at viewer-left. The required correction is that he has TWO little feet. Shorten the pointed lower robe hem slightly and draw two separate short legs emerging beneath it, with two unmistakable stubby dark boots, one left and one right, a clear gap between them. Use small warm bronze-red highlights on each toe so they both read at 52px. Maintain the pose of a tiny floating mage, with the feet relaxed beneath his robe. Keep the robe patterns above the hem, overall silhouette, staff, scale, and chunky 48-grid pixel style as faithful as possible. Produce exactly one square PNG, one centered whole mage, complete staff and two feet visible, 5% transparent padding, true transparent alpha around and between the legs. No other atlas characters, no text, no ground, no cast shadow, no magic circle or bubble shield, no added effects.
```

使用内置 imagegen，以 `photos/怪物立绘/` 下的原图作为造型参考。图集中的四个位置按左上、右上、左下、右下排列。

#### enemy-sheet-a.png

水史莱姆对应 `水史莱姆.png`，丘丘人对应 `丘丘人 (2).png`，射手丘丘人对应 `丘丘射手.webp`，岩丘丘萨满对应 `丘丘萨满.webp`。

```text
Create ONE transparent 2x2 enemy sprite atlas with exactly four complete original-design-inspired pixel-art monsters for a 2D top-down action RPG. The FOUR reference files are supplied in slot order and identify exactly one creature each. Copy the recognizable silhouette, mask shape, face, color blocks, weapon shape or distinguishing appendages. Use the descriptions for assignments. Any reference screenshots' background, watermarks, UI, and writing are irrelevant and must not appear. Distinct chunky 16-bit pixel art, consistent hard-edged squares on a virtual 48px grid per cell, simple 3–4 shades per main color, stepped dark outline, flat color clusters. It must be recognizable at 32–80 pixels. Slightly front-facing full-body battle-ready neutral posture, hats/horns, hands, props and feet intact. Exactly four equal SQUARE cells, one sprite per quadrant, centered with at least 6% true transparent margin on ALL edges, feet or lowest roots approximately 5% above the bottom of its own cell. Leave true transparent gutters around every sprite. No lettering, no panels, no backdrop, no global effects, no glows, no floor shadows. All art must stay in its own quadrant. Do not add any extra creatures.
upper-left 水史莱姆 (hydro-slime), reference 1: Small squat, round domed cyan-blue drop of translucent gel with a flat wobbly base, pale lower rim, just TWO large cream-yellow vertical oval eyes and simple square white highlight clusters. No mouth, antennae, legs or accessories. Make its dome wider than tall and bottom-align it with the others.
upper-right 丘丘人 (hilichurl), reference 2: Small dark charcoal humanoid with shaggy sandy beige mane around the ivory mask, pale curled horns and simple ochre spiral motif on the mask. Face covered, brown cloth skirt and striped wrist wraps. A short heavy brown WOODEN CLUB held up at one side; compact stalking pose.
lower-left 射手丘丘人 (hilichurl-shooter), reference 3: Sandy spiky mane and ivory curved-horn ochre-marked mask, slim dark arms and leather wraps, bent knees and a simple brown WOODEN CROSSBOW with a visible crosspiece held across the front. Keep distinct from the club figure.
lower-right 岩丘丘萨满 (geo-samachurl), reference 4: Tiny hunched dark shaman with a very recognizable pale skull-like grinning mask and black eye sockets, dark angular stone mantle and yellow ochre accents. Holds a gnarled rocky staff with orange golden crystal tips beside it, simplified to a readable silhouette.
```

#### enemy-sheet-b.png

火斧丘丘暴徒对应 `大丘丘人.png`，丘丘岩盔王对应 `丘丘王.webp`，火深渊法师对应 `深渊丘丘.webp`，炽热骗骗花对应 `骗骗花.webp`。

```text
Create ONE transparent 2x2 enemy sprite atlas with exactly four complete original-design-inspired pixel-art monsters for a 2D top-down action RPG. The FOUR reference files are supplied in slot order and identify exactly one creature each. Copy the recognizable silhouette, mask shape, face, color blocks, weapon shape or distinguishing appendages. Use the descriptions for assignments. Any reference screenshots' background, watermarks, UI, and writing are irrelevant and must not appear. Distinct chunky 16-bit pixel art, consistent hard-edged squares on a virtual 48px grid per cell, simple 3–4 shades per main color, stepped dark outline, flat color clusters. It must be recognizable at 32–80 pixels. Slightly front-facing full-body battle-ready neutral posture, hats/horns, hands, props and feet intact. Exactly four equal SQUARE cells, one sprite per quadrant, centered with at least 6% true transparent margin on ALL edges, feet or lowest roots approximately 5% above the bottom of its own cell. Leave true transparent gutters around every sprite. No lettering, no panels, no backdrop, no global effects, no glows, no floor shadows. All art must stay in its own quadrant. Do not add any extra creatures.
upper-left 火斧丘丘暴徒 (axe-mitachurl), reference 1: Bulky muscular charcoal beast with huge shaggy black mane, an angular ivory bone mask and TWO thick curved dark red horns, wrapped limbs and black paws. Holds one broad red-orange axe with a wrapped dark handle across its chest; use a few bright orange blade pixels, no aura or fiery trail.
upper-right 丘丘岩盔王 (stonehide-lawachurl), reference 2: Huge crouched rock-armored beast, gray-brown broad angular rock plates with a few ochre crystal facets, white pointed bone mask, large thick pale horns, broad hands and feet. Powerful bare fists and asymmetrical stone shoulder armor, no weapon, no axe.
lower-left 火深渊法师 (pyro-abyss-mage), reference 3: Short hovering crimson-furred mage in a wide red and dark brown robe with gold and cream trim. Round featureless black face and exactly TWO bright gold dots for eyes, tiny red hood tufts and a dark staff with one orange flame-like tip. Keep the closed red silhouette, omit the giant bubble shield.
lower-right 炽热骗骗花 (pyro-whopperflower), reference 4: Bright russet-orange and ember red plant monster with TWO tall tapering ribbon-like red leaves curved downward at their ends, ivory rounded flower face with two small dark circular eyes, flared orange neck petals and layered brown-red roots. No human arms, no round shield, no detached fire fruit.
```


## 角色像素外观

培养、图鉴与祈愿使用 `shared/character-display-portraits.json` 登记的展示图集，战斗使用 `shared/character-battle-portraits.json` 登记的 Q 版图集。需要原图占位的页面读取 `shared/character-references.json`。

早期立绘的参考原图、提示词和接入记录见 [立绘修订](prompt_log/CHARACTER-PORTRAITS.md)。

攻击与动画使用 SVG 和像素素材。角色通过位移、缩放和转向表现走动与出手，怪物受击时显示闪白、抖动、伤害数字与击破粒子。 [攻击系统说明](ATTACKS.md)

角色与敌怪新版像素图由内置 imagegen 根据用户保存的参考图生成。地图使用 SVG 与像素地形素材。原作角色设计与用户提供的参考图保留原有归属。

武器图片：已根据用户提供的15张参考图，通过内置 imagegen 生成透明底像素 PNG，位于 frontend/public/weapons/pixel/，索引位于 shared/weapon-appearance.json。全部15件已接入培养、图鉴和祈愿结果。原图与像素图对照、完整提示词见 [WEAPON-PIXELS.md](WEAPON-PIXELS.md)。

| 标记 | 所需素材 | 当前替代 |
| --- | --- | --- |
| TODO(asset-character) | 安柏、芭芭拉、丽莎头像及移动/攻击序列帧 | 元素色圆形和符号 |
| TODO(asset-enemy) | 敌怪移动与攻击序列帧 | 像素图集与战斗姿态变换 |
| TODO(asset-map) | 低语森林地形与环境装饰 | 网格地面与树冠圆形 |
| TODO(asset-effect) | 技能和元素反应特效 | 攻击范围圆 |
| TODO(asset-audio) | 音乐、命中与祈愿音效 | 静音 |

后续接入素材时登记来源、使用范围和替换位置。界面币种图标来自 lucide-react，并非原版美术。
