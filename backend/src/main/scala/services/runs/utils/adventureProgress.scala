package services.runs.utils
import services.runs.objects.*
private[runs] def validAdventureSettings(settings: AdventureSettings): Boolean = settings.mode match
  case AdventureMode.Timed => settings.durationSeconds.exists(seconds => seconds>=60 && seconds<=3600)
  case AdventureMode.Endless => settings.durationSeconds.isEmpty

private[runs] def adventureReward(plan: AdventurePlan, kills: Int, ticks: Int): RunReward =
  val rules=plan.rules
  val blocks=ticks/20/rules.timeBlockSeconds
  val complete=plan.settings.mode==AdventureMode.Timed && plan.settings.durationSeconds.exists(seconds => ticks>=seconds*20)
  RunReward(
    blocks*rules.moraPerTimeBlock+kills*rules.moraPerKill+(if complete then rules.completionMora else 0),
    blocks*rules.primogemsPerTimeBlock+(kills/rules.killBlock)*rules.primogemsPerKillBlock+(if complete then rules.completionPrimogems else 0)
  )

private[runs] def maximumAdventureKills(plan: AdventurePlan, ticks: Int): Long =
  val rules=plan.rules
  val step=rules.stepSeconds*20
  val regular=(0 to ticks/step).map(wave =>
    val interval=math.max(rules.minSpawnIntervalTicks,rules.baseSpawnIntervalTicks-wave)
    val batch=math.min(rules.maxSpawnCount,1+wave/rules.spawnCountStepWaves)
    val start=math.max(1,wave*step)
    val end=math.min(ticks,(wave.toLong+1)*step-1)
    math.max(0L,end/interval-(start-1)/interval)*batch
  ).sum
  regular+ticks/1800
