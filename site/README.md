# 游戏宣传页

宣传页介绍《提瓦特：无尽试炼》的玩法，提供关卡实战、地图探索、角色培养和祈愿揭晓四组实机画面。原图位于 `site/previews/`，点击截图可查看大图。点击「开始游戏」进入同一站点下的浏览器单机版。

## 本地查看

在项目根目录安装前端依赖、构建游戏并预览整个站点。

```powershell
npm ci --prefix frontend
npm run build
node site/build.mjs
npm --prefix frontend run preview -- --outDir ../site/dist
```

发布包的根目录是宣传页，`game/` 是单机游戏。玩家在标题画面下载离线资源后，可通过游戏地址离线游玩。 [GitHub Pages 配置说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
