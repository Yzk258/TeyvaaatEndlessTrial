package services.runs.utils
import cats.effect.{IO,IOApp}
import services.runs.api.ListAdventureRulesMessage
import services.runs.objects.*
object AdventureRulesCheck extends IOApp.Simple:
  def run: IO[Unit] =
    for
      rules <- ListAdventureRulesMessage().plan(null)
      plan = AdventurePlan(AdventureSettings(AdventureMode.Endless,None),rules)
      samples = List(0,1,11,12,599,600,601,1199,1200,1799,1800,2400,4800,12000)
      actual = samples.map(ticks =>
        val count=(1 to ticks).map(tick =>
          val wave=tick/(rules.stepSeconds*20)
          val interval=math.max(rules.minSpawnIntervalTicks,rules.baseSpawnIntervalTicks-wave)
          val batch=math.min(rules.maxSpawnCount,1+wave/rules.spawnCountStepWaves)
          (if tick%interval==0 then batch else 0)+(if tick%1800==0 then 1 else 0)
        ).sum
        maximumAdventureKills(plan,ticks)==count
      )
      _ <- IO.raiseUnless(actual.forall(identity))(new RuntimeException("刷怪上限与模拟规则不一致"))
      _ <- IO.raiseUnless(adventureReward(plan,50,2400)==RunReward(660,14) && adventureReward(plan,0,0)==RunReward(0,0))(new RuntimeException("无尽进度奖励错误"))
      timed=plan.copy(settings=AdventureSettings(AdventureMode.Timed,Some(120)))
      _ <- IO.raiseUnless(adventureReward(timed,50,2400)==RunReward(810,24) && adventureReward(timed,49,599)==RunReward(490,0))(new RuntimeException("限时完成或奖励门槛错误"))
      _ <- IO.println("PASS: 刷怪上限逐帧交叉核对、时长与击杀奖励门槛、限时完成加成")
    yield ()
