# 开场像素背景工作记录

点击进入后，背景用 850 毫秒向门推进并轻微压暗，随后打开本地存档窗口。新建、继续或导入存档后，背景淡出 350 毫秒，再显示主页面。开启减少动态效果时省略过渡时长。

使用内置 image_gen 工具，根据用户提供的原神开场截图生成像素风版本。采用中央闭合蓝色石门、正面石路、两侧圆柱、云海和左侧暖光的构图；无文字、标志或界面按钮。

最终图片：frontend/public/backgrounds/sky-gate-pixel-v2.png。首次偏装饰性的方案未接入项目，以用户补充参考图后的本版为准。

标题页底部保留「点击进入」，发布版在右上角提供离线资源下载。手机端将大门居中裁切，交互由界面按钮和存档窗口提供。

## 开场动效

门、柱子和石路使用原底图。两张云层以 16 秒为周期交替淡入淡出，同时缓慢位移，左侧暖光随循环明暗变化。动画在存档窗口打开时继续播放，开启减少动态效果时显示静态背景。

用内置图像生成工具，以原开场图作为构图与配色参考，生成两张 1672 × 941 的透明云层。两张素材均加入离线资源。 [云层 A](../../frontend/public/backgrounds/sky-gate-clouds-a.png) · [云层 B](../../frontend/public/backgrounds/sky-gate-clouds-b.png)

### 云层生成提示词

以下为两帧共用的提示词，每次生成追加对应帧的描述。

~~~text
Create a single 16:9 transparent RGBA overlay frame for a seamless ambient animation on top of the supplied pixel-art sky-gate scene. The supplied scene is a placement and palette reference. Deliver ONLY the newly added atmospheric details on genuine empty alpha, no background. The opaque stone gate, all pillars, bridge, original sky and existing clouds are provided as a separate plate, so DO NOT draw any of that architecture, a sky wash, a colored canvas or an overall haze. Match the reference's fine deliberate stepped pixel clusters, pale ivory and lavender-blue cloud shading, warm amber from upper left. Keep the overlay sparse and very delicate, about 85–90% fully transparent. Create two low, thin uneven wisps hugging the bottom left and bottom right cloudbanks, and a few extremely thin broken flecks of pale high cloud in the upper sky. Keep the middle clear from 42% to 58% of frame width at all heights so the door and approach stay readable. Keep the new clouds close to the base cloud colors. Use light wispy breakup and tapered ends, not large cartoon blobs. Add only a couple tiny pale gold pixel highlights near the left-side wisps. No UI, no text, no icons or borders. This is an effects plate, transparent between every mark.
~~~

~~~text
Frame A: the wisps rise a little toward the left and drift inward slightly from both lower edges. Place a thin broken high cloud at x=59–70%, y=19–24%. Soft amber illumination on the lower-left tips.
Frame B: the same thin wisps have drifted a small distance right and a little downward. Place the high cloud at x=63–74%, y=20–25%. The left highlights are slightly brighter and a few lower-right tips catch pale ivory light.
~~~

## 最终生成提示词

+Create a PIXEL ART background following the attached Genshin gate screenshot reference closely, not the earlier ornate golden gate. Match screenshot composition: a SINGLE CLOSED BLUE STONE DOOR exactly in the CENTER, straight stone causeway leading from bottom-center up to this door, numerous isolated tall cylindrical ivory ancient columns on both sides receding into the distance, huge cropped column on the far right edge, soft cloud sea below, deep blue sky, warm golden sunlight from far left. Door has simple angular pointed frame and subtle geometric blue engravings, no gold celestial emblem, no gigantic arch, no open doorway, no railings, no added flowers or vegetation. Keep the scene sparse and close to the provided reference. Faithful 16:9 wide landscape composition. Genuine retro game pixel art: coarse clearly visible square pixel clusters, sharp nearest-neighbor edges, hand-placed 16/32-bit pixel shading and restrained palette; do not make a smooth painting or blur. No text, no logo, no UI, no age-rating badge, no icons, no characters. The entire image is just the scenery. All UI will be added separately by code.
