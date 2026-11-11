# 武器像素图工作记录

根据用户保存于 `武器/` 的15张 WebP 参考图，使用内置图像生成工具 imagegen 逐张生成像素风格的透明背景 PNG。原参考图保留，生成图为参考原作武器的同人素材，不标记为原创武器设计。

图片位于 `frontend/public/weapons/pixel/`，中文名称与参考图对应；外观索引位于 `shared/weapon-appearance.json`。采用完整武器轮廓、有限色阶、方块像素与深色轮廓线，不带文字、卡框或背景。

打开 [原图与像素图对照](assets/weapon-pixel-preview.html) 可逐项比较；运行前端后也可访问 `/weapons/pixel/index.html` 浏览和下载。

全部15件武器现已配置数值、成长与天赋，可通过武器祈愿获取，并在培养、图鉴和祈愿结果中使用像素图。具体配置见 [武器机制](WEAPONS.md)。外观资源不决定词条、攻击判定或抽取概率。

完整的逐张提示词、参考图路径和输出路径记录在 [生成记录](assets/weapon-pixel-generation.json)。没有对生成结果执行额外裁切、滤镜或缩放；页面使用像素化采样显示。

验证：`node tools/verify-weapon-pixels.mjs` 检查全部15张图片格式、透明通道、透明边角及尺寸；`npm run build` 检查前端类型和构建。
