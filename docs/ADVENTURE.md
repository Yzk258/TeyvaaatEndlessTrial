# 限时冒险、无尽敌潮与进度奖励

冒险营地提供限时、无尽两种玩法，均保留区块地图和镜头跟随。关卡挑战继续使用有限场地、固定敌人数与通关奖励。

## 玩家流程

1. 选择限时冒险（2、5、10分钟，或自定义60～3600秒）或无尽模式。
2. 读取角色、武器、冒险设置与规则快照，进行3秒准备倒计时。
3. 作战栏显示剩余时间／坚持时间、敌潮难度、场上数量及预计结算资源。
4. 限时到点或角色倒下时结束战斗，回收剩余粒子后领取奖励；无尽模式没有预设结束时间。
5. 玩家可随时点击退出，网页弹窗展示累计摩拉和原石，确认后结算并返回营地。未吸收的摩拉粒子也按实际击杀计入奖励，不重复叠加。

有效进度使用独立的 combatTicks（每秒20步）。准备、暂停、升级选项和结束时的粒子回收不增加进度。视觉动画仍可使用 tick，避免延长粒子动画就多获得计时奖励。尚未开始战斗便撤离，奖励为0。

## 递增难度

统一配置位于 shared/adventure-rules.json。每30秒进入下一档，令 w=floor(combatTicks/600)：

| 项目 | 规则 |
| --- | --- |
| 新生敌人生命 | 基础生命 × (1+0.25w)，向上取整 |
| 新生敌人接触伤害 | 基础伤害4 × (1+0.12w)，向上取整 |
| 刷怪间隔 | max(4,12−w) 步 |
| 每批普通敌人数 | min(4,1+floor(w/2)) |
| 场上敌人上限 | min(240,80+12w) |
| 首领 | 每90秒尝试生成1只，同样提高生命与伤害，并受场上总数限制 |

敌人出生时固定其属性，已有敌人保留出生档位。数量与频率设置上限以控制页面开销，生命和伤害继续随时间增长。刷怪仍遵守地形碰撞，找不到合法出生点时跳过。关卡敌人的原有数值与数量规则保持不变。

## 资源计算

令 B=floor(combatTicks/600)，K为击杀数；C在限时到点时为1，其他情况为0。

| 资源 | 公式 |
| --- | --- |
| 摩拉 | 40B + 10K + 150C |
| 原石 | 3B + 2floor(K/50) + 10C |

不足一个30秒区间的时间不计算区间奖励，击杀摩拉照常累计。例如无尽冒险90秒击败100名敌人，撤离可获得1120摩拉、13原石；完成120秒限时冒险并击败50名敌人，获得810摩拉、24原石。无尽模式没有限时完成加成。

死亡、主动撤离同样按有效进度计算冒险奖励。关卡挑战仍须全部击败敌人才领取固定奖励，失败或放弃不发通关奖励。

## 类型、函数与服务边界

- AdventureMode 是 timed／endless 的封闭类型；前端 AdventureSettings 使用区分联合，后端用枚举与 Option 表达时长并校验合法组合。
- AdventurePlan 包含设置与规则快照。StartRunMessage 验证设置、固定角色与武器，并把快照写入 run_adventures；重试相同请求返回同一局，换模式或时长必须使用新请求。
- adventureDifficulty、adventureComplete、adventureReward 是只依赖输入的纯函数。stepBattle 消费不可变战斗状态，处理生成、伤害、倒计时和结束，不写钱包。
- AdventureTable 与其初始化器封装快照持久化；SQL 和连接操作留在所属表模块。
- SubmitRunResultMessage 读取归属与开局快照，校验现实经过时间、所选时长、最大可生成敌人数，再在同一事务中写入钱包、流水和 Settled 状态。客户端只提交击杀与有效步数，不能指定奖励金额。
- AbandonRunMessage 对冒险接收进度并执行同一套结算；关卡放弃仍记录 Abandoned。相同结果重复提交不再发奖，不同结果的重复提交被拒绝。

本版对局仍在客户端模拟，服务器检查时间和数量边界，并非完整的服务器逐帧重演。刷新或关闭网页无法恢复内存中的局内进度；需要主动使用撤离按钮完成结算。

## 验证

- npm run build：TypeScript 与前端构建。
- npm run compile:backend：Scala 编译。
- node tools/verify-battle.mjs：独立战斗计时、难度增长、生成数量与上限、伤害、限时结束、暂停冻结和进度奖励。
- powershell -NoProfile -ExecutionPolicy Bypass -File tools/backend.ps1 verify-adventure：刷怪数量逐帧交叉核对、设置验证、快照、零进度、撤离奖励、完成奖励、异常数据与并发结算。
- node tools/verify-adventure-ui.mjs：独立浏览器验证输入边界、自定义开局、无尽开局、退出弹窗、奖励结果和限时倒计时。
- node tools/verify-api.mjs、node tools/verify-stages.mjs、node tools/verify-abandon.mjs：原有账户、祈愿、培养和关卡回归。

页面截图位于 docs/assets/adventure-timed.png、adventure-custom.png、adventure-endless.png、adventure-withdrawal.png。
