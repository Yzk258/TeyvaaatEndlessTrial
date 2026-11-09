# 角色立绘修订

按用户要求制作6名角色：安柏、芭芭拉、丽莎、凯亚、班尼特、迪卢克。培养页使用半身构图；未设计角色在培养页使用原作参考图占位，在其他页面和战斗中显示“立绘待设计”，不再显示旧网格脸。

使用内置 imagegen 图像工具，逐张参考用户保存在 `角色立绘/` 中的原作图片生成透明底像素风立绘。重点保留发型、眼睛、原服装轮廓、配色和标志性配饰，不再使用同一张通用脸与衣服模板。原图保留，生成图作为参考原作的同人素材，不标记为原创角色设计。

| 角色 | 参考图 | 输出 PNG |
| --- | --- | --- |
| 安柏 | 角色立绘/安伯.png | frontend/public/characters/pixel/amber-v2.png |
| 芭芭拉 | 角色立绘/芭芭拉.jpg | frontend/public/characters/pixel/barbara-v2.png |
| 丽莎 | 角色立绘/lisa.jpg | frontend/public/characters/pixel/lisa-v2.png |
| 凯亚 | 角色立绘/凯亚.jpg | frontend/public/characters/pixel/kaeya-v2.png |
| 班尼特 | 角色立绘/班尼特.png | frontend/public/characters/pixel/bennett-v2.png |
| 迪卢克 | 角色立绘/地卢克.png | frontend/public/characters/pixel/diluc-v2.png |

完整提示词、生成来源和文件路径见 [逐张生成记录](assets/character-portrait-generation.json)。图片为1024×1536 RGBA，直接保留生成结果及透明通道，没有执行额外滤镜、缩放或裁切。

[原版参考对照](assets/character-portrait-comparison.html) / [六人预览](assets/character-portraits-v2-preview.png)。运行前端后可访问 `/characters/pixel/index.html` 查看与下载。

## 接入方式

shared/character-portraits.json 登记6张像素图片，shared/character-references.json 登记其余12人的原图占位。CharacterPortrait 根据取景与页面要求显示像素立绘、参考图或待设计文字。角色培养、图鉴、祈愿揭晓和战场复用该组件，外观与数值、抽取概率、攻击判定保持独立。培养布局见 [培养与局内成长](PROGRESSION.md)。

战斗继续使用原有位移、朝向和出手状态。新立绘已经包含鞋子，不叠加旧版通用脚块；走动时对图像下部做轻微分层脚步显示，配合身体起伏和倾斜。该处理仅发生于SVG显示，不修改PNG文件和碰撞坐标。静态页面不会播放脚步。

旧 tools/generate-appearance.py 仍负责旧网格素材，不会覆盖新PNG；最终是否使用新图由外观索引决定。

## 验证

- 6张PNG均包含RGBA透明通道，浏览器棋盘格预览已检查。
- 培养、图鉴、祈愿与战场使用统一入口；缺少新像素图的角色不再使用旧网格脸。
- npm run build 通过；node tools/verify-battle.mjs 通过。
- 新立绘和战斗关键帧已使用独立浏览器配置截图检查。
