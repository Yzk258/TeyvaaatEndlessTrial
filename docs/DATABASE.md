# PostgreSQL 数据库系统

账号系统新增accounts、login_sessions、login_attempts、role_audit四张表，保存凭据/角色、会话摘要、失败限速与角色审计。旧users和资产表保留。现支持用户名密码登录，以下“仅体验令牌”的边界说明为历史状态，以 [账号说明](AUTH.md) 为准。

## 当前状态

项目原先已使用 PostgreSQL 持久化业务数据。本次补齐连接池、配置读取、数据库版本升级、健康检查和运维命令，没有重建或清空存档。

当前包含11张业务表与1张版本管理表。浏览器本地主要保存体验令牌；余额、角色、武器、装备和对局结果由后端数据库维护。

## 表与归属

| 服务 | 表 | 保存内容 |
| --- | --- | --- |
| identity | users | 档案ID、昵称、体验令牌 |
| economy | wallets | 原石、摩拉余额，带非负约束 |
| economy | currency_ledger | 每次货币变更及业务原因 |
| characters | characters | 玩家角色、等级、重复印记 |
| weapons | owned_weapons | 玩家武器、等级、重复记录 |
| weapons | weapon_equipment | 角色装备，复合外键验证归属，唯一约束限制同武器重复装备 |
| wishes | banner_pity | 角色／武器各自保存四星／五星进度；旧 pity_states / weapon_pity 仅保留迁移来源 |
| runs | runs | 对局种子、角色等级、状态、时长、击杀 |
| runs | run_challenges | 开局时关卡与奖励快照 |
| system | operation_receipts | 请求标识、业务类别、参数指纹、结果与记录时间 |
| system | schema_versions | 已成功执行的结构升级及时间 |

角色/武器定义和像素外观继续由shared配置文件管理，不在这次工作中增加在线数据库编辑器。开局返回的角色、武器配置快照保存在该请求的持久回执中。

## 事务与连接池

HikariCP连接池默认最大6条连接，获取连接等待默认5000毫秒。池在应用启动时创建、退出时关闭；每个请求通过Resource借用和归还连接，业务操作共用同一连接。

成功提交；发生异常回滚；操作被取消时也先回滚，再归还连接。抽取、培养和结算仍由原有用户行锁与幂等机制控制，不因为连接复用而改变业务事务。

## 配置与启动

把 backend/.env.example 复制为 backend/.env 并按本机数据库填写。通过 npm run start:backend 启动时自动读取该文件，进程已有环境变量优先；只接受列出的DB配置，不执行配置中的代码。直接运行 sbt 时仍需自行设置进程环境变量。

| 变量 | 默认值 |
| --- | --- |
| DB_URL | jdbc:postgresql://127.0.0.1:5433/teyvat |
| DB_USER | db |
| DB_PASSWORD | 本地开发默认值见示例文件 |
| DB_POOL_SIZE | 6 |
| DB_CONNECTION_TIMEOUT_MS | 5000 |

示例仅为本机开发配置，不会自动创建PostgreSQL用户或启动服务。需先安装、启动PostgreSQL，并给连接用户建库权限或预先创建数据库。脚本默认在D:/postgresql/bin寻找工具，也可通过-PostgresBin指定路径，或使用PATH中的工具。

在teyvat工作区执行：

    npm run db:init
    npm run start:backend
    npm run db:status
    npm run db:backup

db:init仅在数据库不存在时创建，已存在时保留数据；表由后端启动初始化。db:status显示表与估算行数，不输出令牌或个人明细。db:backup生成PostgreSQL custom格式备份到.local/backups，已排除版本控制。

## 结构升级

启动时取得数据库事务级advisory lock，创建版本表，再按外键顺序执行各服务自有表初始化。升级SQL保留在对应TableInitializer，system仅编排调用，不收集其他服务SQL。

当前版本标记：

- baseline.v1：已有业务结构基线。
- runs.status.v2：对局状态支持abandoned，仅升级一次。
- runs.history-index.v1：按玩家查询对局历史的索引。
- ledger.history-index.v1：按玩家查询流水的索引。
- receipts.audit.v1：回执记录时间与玩家历史索引。

版本标记和DDL在同一事务提交；失败不记录成功版本。后续改变结构应增加新版本，不修改已执行版本的含义。旧回执新增的created_at是升级时补入的时间，不能当作旧抽取真实发生时间。

## 健康检查

GET /api/health实际从连接池读取schema_versions；成功返回database=ready和已应用迁移数，故障返回503，不把数据库异常或连接凭据返回给前端。

## 备份与恢复

本次升级前已为现有数据库生成备份，并确认pg_restore能够读取目录。完整恢复演练尚未执行。

建议先恢复到新数据库检查，不覆盖正在使用的teyvat。例如先创建teyvat_restore，再用：

    pg_restore --no-owner --exit-on-error -h 127.0.0.1 -p 5433 -U db -d teyvat_restore <备份文件路径>

备份与.local/verification中的验收文件含存档或体验令牌，不提交版本控制，不作为公开素材。

## 验证

停止本项目后端的sbt进程后运行事务测试，避免同一工程的sbt命名管道冲突：

    npm run verify:database-transaction

测试在写入后故意抛异常，以及写入后取消操作，验证余额不变、连接仍可使用。

启动后端后：

    node tools/verify-database.mjs prepare

该命令创建独立验收档案，将预期结果写入.local/verification。重启后端，再执行：

    node tools/verify-database.mjs check

检查角色、武器、余额、幂等回执、放弃状态均保留，迁移数量不增长。已有verify-api、verify-stages、verify-abandon、verify-weapons用于业务回归。

本次实际结果：编译通过；已有数据库完成升级；备份生成且目录可读取；异常与取消回滚通过；后端重启后的持久化、幂等和重复迁移检查通过；角色/武器/资产/关卡/退出回归通过。数据库状态命令及配置文件优先级也已验证。

## 当前边界

体验令牌尚不是正式账号密码系统，丢失令牌没有找回流程。数据库保存长期资产与对局记录，不保存每帧战斗状态，刷新后不能接续进行中的战斗。前端战果真实性也不会因使用数据库而自动得到保证。
