# 提瓦特：无尽试炼（暂定）

以《原神》角色和世界观为主题的 2D 像素生存游戏。选择角色和装备进入试炼，在敌潮中走位、自动攻击并选择局内强化。结算后可用获得的资源培养角色和武器，或用于祈愿。

## 玩法

- **限时冒险与无尽模式**。地图按区块生成，包含湖泊、树林、岩群、遗迹和传送锚点。限时冒险支持自定义时长，无尽模式逐波加难，每十波出现丘丘王。主动撤离也会按进度结算。 [冒险规则](docs/ADVENTURE.md) · [地图生成](docs/TILE_MAPS.md)
- **关卡挑战**。在固定场地击败指定数量的敌人，通关获得摩拉和原石。
- **局内成长**。用 WASD 或方向键移动，角色会自动攻击。击败敌人后吸收经验，升级时从三个随机选项中选择强化。按 Esc 暂停。 [攻击判定](docs/ATTACKS.md) · [掉落与强化](docs/PROGRESSION.md)
- **培养、祈愿与图鉴**。角色和武器分开培养，可为角色装备适配武器。角色池和武器池各有保底，图鉴可查看收集进度。 [角色配置](docs/CHARACTERS.md) · [武器培养](docs/WEAPONS.md) · [祈愿规则](docs/WISHES.md)
- **账号存档与教程**。登录后进入综合页，查看出战配置与收集进度。点击导航中的“教程”可逐步查看各个入口的高亮指引。 [登录与权限](docs/AUTH.md)

## 本地启动

需要 Node.js、JDK、sbt、PostgreSQL 和 Windows PowerShell。先启动 PostgreSQL，复制 `backend/.env.example` 为 `backend/.env`，并填写本机连接信息。默认数据库为 `teyvat`，地址为 `127.0.0.1:5433`，开发用户为 `db`。建库脚本需要已有的 PostgreSQL 用户和相应权限。 [数据库配置](docs/DATABASE.md)

在项目根目录执行：

```powershell
npm --prefix frontend install
npm run db:init
npm run start:backend
```

另开一个终端，在项目根目录执行：

```powershell
npm run dev
```

打开 [游戏页面](http://127.0.0.1:5175)，点击进入后注册或登录。开发环境下后端监听 `127.0.0.1:8085`，前端通过 `/api` 代理访问。

## 项目结构

前端采用 React、TypeScript 和 SVG，战斗模拟通过纯函数更新状态。后端采用 Scala 3、Cats Effect 和 http4s，负责账号、培养、祈愿和奖励结算，存档保存在 PostgreSQL 中。

| 目录 | 内容 |
| --- | --- |
| [frontend/src/](frontend/src/) | 页面、战斗模拟与渲染 |
| [frontend/public/](frontend/public/) | 游戏实际加载的像素素材 |
| [backend/](backend/) | API、业务逻辑和数据库持久化 |
| [shared/](shared/) | 角色、武器、关卡等共享配置 |
| [tools/](tools/) | 启动、运维和验证脚本 |
| [docs/](docs/) | 机制说明、素材记录和工作日志 |

## 验证

```powershell
npm run build
npm run compile:backend
node tools/verify-battle.mjs
```

后端启动后，可运行 `node tools/verify-api.mjs` 验证接口。脚本会创建专用测试档案。

## 开发记录

[工作日志](docs/WORKLOG.md) 收录历次开发记录和早期设计草案。 [素材说明](docs/ASSETS.md) 记录素材来源与用途。
