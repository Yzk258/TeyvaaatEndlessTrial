# 传送锚点像素素材

使用内置 imagegen，以用户提供的锚点截图作为造型参考。透明 PNG 保存于 `frontend/public/terrain/waypoint-v2.png`。

地图每 2×2 个区块最多放置一座锚点。候选格必须位于开阔陆地，且四邻格可行走。出生区与主通路不放置锚点，起点所在区域优先选择离角色较近的合格格。锚点使用石座碰撞，作为地图地标展示。

## 生成提示词

Use case: stylized-concept. Create one NEW transparent sprite for a 2D pixel-art adventure RPG, based on the teleport waypoint landmark in the reference image. The screenshot is a reference for the shape and colors only. Isolate the waypoint itself, including its small circular pale stone pedestal. Preserve the distinctive tall floating two-part silhouette: at the top a royal-blue crystal cradled by two curved ivory prongs and an antique brass bowl, below a slender silver stone collar and an inverted pointed cobalt crystal with a narrow gold rim. Leave a clearly visible gap beneath the suspended point, with a few tiny square blue motes descending to a thin luminous cyan ring carved into the stone pedestal. Camera is slightly elevated 3/4 front-facing, just enough to see the top of the pedestal, matching a classic 16-bit top-down RPG. Crisp real pixel art, readable silhouette at roughly 40 by 64 game pixels, deliberate square pixel clusters, controlled blue and cyan highlights, warm muted gold, textured pale gray stone, hard stepped edges. Center the entire object vertically with small transparent padding on all sides. Narrow crystal and compact base. Actual transparent alpha beyond the sprite. No background or landscape, no grass, no rocks around the base, no letters, no logo, no UI, no characters, no fog or blurry exterior glow. The blue glow is represented by discrete pixels, never a diffuse halo.
