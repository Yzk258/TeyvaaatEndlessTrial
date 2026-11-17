# 游戏宣传页

宣传页介绍《提瓦特：无尽试炼》的三种试炼、角色突破、装备培养和祈愿。画廊展示首领出招、地脉实战、祈愿揭晓、武器培养、圣遗物培养及火元素突破晶石。界面预览使用当前游戏画面，晶石使用游戏内图标。点击「开始游戏」进入同一站点下的浏览器单机版。

## 本地查看

在项目根目录安装前端依赖、构建游戏并预览整个站点。

```powershell
npm ci --prefix frontend
npm run build
node site/build.mjs
npm --prefix frontend run preview -- --outDir ../site/dist
```

发布包的根目录是宣传页，`game/` 是单机游戏。玩家在标题画面下载离线资源后，可通过游戏地址离线游玩。 [GitHub Pages 配置说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
