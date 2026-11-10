# 开场像素背景

点击进入后，背景用 850 毫秒向门推进并轻微压暗，随后打开本地存档窗口。新建、继续或导入存档后，背景淡出 350 毫秒，再显示主页面。开启减少动态效果时省略过渡时长。

使用内置 image_gen 工具，根据用户提供的原神开场截图生成像素风版本。采用中央闭合蓝色石门、正面石路、两侧圆柱、云海和左侧暖光的构图；无文字、标志或界面按钮。

最终图片：frontend/public/backgrounds/sky-gate-pixel-v2.png。首次偏装饰性的方案未接入项目，以用户补充参考图后的本版为准。

标题页底部保留「点击进入」，发布版在右上角提供离线资源下载。手机端将大门居中裁切，交互由界面按钮和存档窗口提供。

## 开场动效

门扉界面加入入场与氛围动画：顶部标题“TEYVAT · ENDLESS TRIAL / 提瓦特 / 无尽试炼”与分隔线依次上浮淡入（gate-rise，每行错开约 0.12s）；中央一道柔光柱缓慢明暗呼吸（gate-glow）；16 个暖色光点从底部上浮飘散（gate-mote，随机错开延迟与时长）；顶部与底部叠加渐变让文字更清晰。底部按钮改为居中圆角玻璃按钮，hover 有横向流光与边框提亮，下方一行小字提示。进入过渡阶段显示“正在进入…”状态。所有动画尊重“减少动态效果”，开启时静止显示。动效预览见 [开场预览](assets/opening-preview.html)（`node tools/preview-opening.mjs` 重新生成）。

## 最终生成提示词

+Create a PIXEL ART background following the attached Genshin gate screenshot reference closely, not the earlier ornate golden gate. Match screenshot composition: a SINGLE CLOSED BLUE STONE DOOR exactly in the CENTER, straight stone causeway leading from bottom-center up to this door, numerous isolated tall cylindrical ivory ancient columns on both sides receding into the distance, huge cropped column on the far right edge, soft cloud sea below, deep blue sky, warm golden sunlight from far left. Door has simple angular pointed frame and subtle geometric blue engravings, no gold celestial emblem, no gigantic arch, no open doorway, no railings, no added flowers or vegetation. Keep the scene sparse and close to the provided reference. Faithful 16:9 wide landscape composition. Genuine retro game pixel art: coarse clearly visible square pixel clusters, sharp nearest-neighbor edges, hand-placed 16/32-bit pixel shading and restrained palette; do not make a smooth painting or blur. No text, no logo, no UI, no age-rating badge, no icons, no characters. The entire image is just the scenery. All UI will be added separately by code.
