# 素材待办

开场背景已使用内置图像生成工具，按用户参考截图制作像素版中央蓝门与云海场景，保存至frontend/public/backgrounds/sky-gate-pixel-v2.png，界面按钮由代码独立叠加。提示词及使用位置见LOGIN-BACKGROUND.md。

## 敌怪像素形象

史莱姆、丘丘人、暴徒首领已替换为像素形象，配置位于 shared/enemy-appearance.json。分别使用16×16、20×24、24×28网格，战场按类别缩放；首领明显更大，史莱姆随逻辑时间轻微起伏，暂停时也停止。当前是手工像素同人简化设计，不是原作素材。

预览见 assets/enemies-preview.png。PixelArtwork按调色板合并SVG路径，避免每个像素创建单独节点。外观不改变敌怪生命、伤害、经验和碰撞范围。

## 角色像素外观

安柏、芭芭拉、丽莎、凯亚、班尼特、迪卢克已按用户提供的原作参考图重做透明底像素立绘，图片位于 frontend/public/characters/pixel/，由 shared/character-portraits.json 索引。培养页为半身取景，未设计角色使用 frontend/public/characters/references/ 中的原图占位；其余页面显示待设计文字，旧网格脸不再作为角色立绘展示。培养、图鉴、祈愿和战场复用 CharacterPortrait，美术与数值、判定分离。

新预览见 [character-portraits-v2-preview.png](assets/character-portraits-v2-preview.png)，参考原图、逐张提示词及接入方式见 [立绘修订](CHARACTER-PORTRAITS.md)。assets/characters-preview.png 与 character-roster-preview.png 仅保留为旧网格版本记录。

攻击与动画：已接入四种配置化攻击表现、角色走动／出手姿态、怪物受击闪白、抖动、伤害数字与击破粒子，使用SVG与已有像素素材。当前角色动作是姿态变换与简化脚步；完整多方向序列帧仍待补充。设计及预览见 [ATTACKS.md](ATTACKS.md)。

角色新版像素图由内置 imagegen 根据用户保存的原版参考生成；未设计角色使用原图占位或待设计文字。怪物与地图使用已有SVG／网格素材，旧角色网格仅作历史文件保留。原作角色设计与用户提供的参考图不标记为项目原创。

武器图片：已根据用户提供的15张参考图，通过内置 imagegen 生成透明底像素 PNG，位于 frontend/public/weapons/pixel/，索引位于 shared/weapon-appearance.json。全部15件已接入培养、图鉴和祈愿结果。原图与像素图对照、完整提示词见 [WEAPON-PIXELS.md](WEAPON-PIXELS.md)。

| 标记 | 所需素材 | 当前替代 |
| --- | --- | --- |
| TODO(asset-character) | 安柏、芭芭拉、丽莎头像及移动/攻击序列帧 | 元素色圆形和符号 |
| TODO(asset-enemy) | 史莱姆、丘丘人及首领动画 | 圆形敌人；暂只有一类普通怪行为 |
| TODO(asset-map) | 低语森林地形与环境装饰 | 网格地面与树冠圆形 |
| TODO(asset-effect) | 技能和元素反应特效 | 攻击范围圆 |
| TODO(asset-audio) | 音乐、命中与祈愿音效 | 静音 |

后续接入素材时登记来源、使用范围和替换位置。界面币种图标来自 lucide-react，并非原版美术。
