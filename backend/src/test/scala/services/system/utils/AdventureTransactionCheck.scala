package services.system.utils
import cats.effect.{IO,IOApp}
import cats.syntax.all.*
import services.system.api.InitializeDatabaseMessage
import services.identity.api.CreateGuestMessage
import services.identity.tables.user.UserTable
import services.characters.objects.CharacterId
import services.runs.api.*
import services.runs.objects.*
import services.runs.tables.run.RunFixtureTable
import services.runs.tables.adventure.AdventureTable
import services.economy.api.GetProfileMessage
object AdventureTransactionCheck extends IOApp.Simple:
  private def check(value: Boolean, message: String): IO[Unit] = IO.raiseUnless(value)(new RuntimeException(message))
  private def request: IO[String] = IO(java.util.UUID.randomUUID().toString)
  def run: IO[Unit] = databasePool.use(pool =>
    for
      _ <- transaction(pool)(InitializeDatabaseMessage().plan)
      session <- transaction(pool)(CreateGuestMessage("冒险奖励事务验收").plan)
      user <- transaction(pool)(c => UserTable.resolve(c,session.token).flatMap(value => IO.fromOption(value)(new RuntimeException("测试身份缺失"))))
      before <- transaction(pool)(GetProfileMessage(user).plan)
      key <- request
      timed = AdventureSettings(AdventureMode.Timed,Some(120))
      endless = AdventureSettings(AdventureMode.Endless,None)
      start = StartRunMessage(user,CharacterId("amber"),key,None,Some(timed))
      first <- transaction(pool)(start.plan)
      replay <- transaction(pool)(start.plan)
      _ <- check(first==replay && first.adventure.exists(_.settings==timed),"开局幂等或模式快照失败")
      conflict <- transaction(pool)(StartRunMessage(user,CharacterId("amber"),key,None,Some(endless)).plan).attempt
      _ <- check(conflict.isLeft,"同请求更换模式未拒绝")
      invalid <- List(AdventureSettings(AdventureMode.Timed,Some(59)),AdventureSettings(AdventureMode.Timed,Some(3601)),AdventureSettings(AdventureMode.Timed,None),AdventureSettings(AdventureMode.Endless,Some(120))).traverse(settings =>
        request.flatMap(id => transaction(pool)(StartRunMessage(user,CharacterId("amber"),id,None,Some(settings)).plan).attempt)
      )
      _ <- check(invalid.forall(_.isLeft),"非法模式时长未拒绝")
      noProgress <- transaction(pool)(SubmitRunResultMessage(user,RunId(first.runId),0,0).plan)
      _ <- check(noProgress.mora==before.mora && noProgress.primogems==before.primogems,"零进度仍有资源奖励")
      endlessKey <- request
      withdrawal <- transaction(pool)(StartRunMessage(user,CharacterId("amber"),endlessKey,None,Some(endless)).plan)
      _ <- transaction(pool)(c => RunFixtureTable.age(c,user,RunId(withdrawal.runId),90))
      forged <- transaction(pool)(SubmitRunResultMessage(user,RunId(withdrawal.runId),10000,1800).plan).attempt
      future <- transaction(pool)(SubmitRunResultMessage(user,RunId(withdrawal.runId),0,18000).plan).attempt
      _ <- check(forged.isLeft && future.isLeft,"不合理击杀或时长未拒绝")
      settled <- List(
        transaction(pool)(AbandonRunMessage(user,RunId(withdrawal.runId),100,1800).plan),
        transaction(pool)(SubmitRunResultMessage(user,RunId(withdrawal.runId),100,1800).plan)
      ).parSequence
      _ <- check(settled.forall(p => p.mora==before.mora+1120 && p.primogems==before.primogems+13 && p.runs==before.runs+2),"撤离奖励、并发幂等或状态错误")
      modified <- transaction(pool)(SubmitRunResultMessage(user,RunId(withdrawal.runId),101,1800).plan).attempt
      _ <- check(modified.isLeft,"不同结果重复结算未拒绝")
      timedKey <- request
      completion <- transaction(pool)(StartRunMessage(user,CharacterId("amber"),timedKey,None,Some(timed)).plan)
      _ <- transaction(pool)(c => RunFixtureTable.age(c,user,RunId(completion.runId),120))
      tooLong <- transaction(pool)(SubmitRunResultMessage(user,RunId(completion.runId),0,2401).plan).attempt
      _ <- check(tooLong.isLeft,"限时时长上限未校验")
      completed <- transaction(pool)(SubmitRunResultMessage(user,RunId(completion.runId),50,2400).plan)
      _ <- check(completed.mora==before.mora+1930 && completed.primogems==before.primogems+37,"限时完成奖励错误")
      snapshot <- transaction(pool)(c => AdventureTable.get(c,RunId(completion.runId)))
      _ <- check(snapshot==completion.adventure,"规则快照未持久化")
      _ <- IO.println("PASS: 模式/时长校验、开局幂等与冲突、零进度零奖励、撤离按进度奖励、限时额外奖励、规则持久化、并发仅发一次、结果与时长防伪")
    yield ()
  )
