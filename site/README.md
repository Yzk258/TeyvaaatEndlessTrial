# 游戏宣传页

宣传页介绍《提瓦特：无尽试炼》的玩法，提供战斗、地图、培养三组预览。点击「开始游戏」进入同一站点下的浏览器单机版。

## 本地查看

在项目根目录安装前端依赖、构建游戏并预览整个站点。

~~~powershell
npm ci --prefix frontend
npm run build
node site/build.mjs
npm --prefix frontend run preview -- --outDir ../site/dist
~~~

## 发布到 GitHub Pages

1. 在 GitHub 仓库的 **Settings → Pages** 中，将 **Source** 设为 **GitHub Actions**。
2. 把游戏、宣传页及其工作流提交并推送到仓库的 `main` 分支。
3. 在 **Actions → Deploy game to GitHub Pages** 中查看发布结果，必要时点击 **Run workflow**。发布成功后，可在 **Settings → Pages** 查看宣传页网址。

发布包的根目录是宣传页，`game/` 是单机游戏。玩家在标题画面下载离线资源后，可通过游戏地址离线游玩。 [GitHub Pages 配置说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
