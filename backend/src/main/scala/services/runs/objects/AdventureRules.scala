package services.runs.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AdventureRules(
  stepSeconds: Int, healthGrowthPercent: Int, damageGrowthPercent: Int,
  baseSpawnIntervalTicks: Int, minSpawnIntervalTicks: Int, maxSpawnCount: Int, spawnCountStepWaves: Int,
  baseEnemyLimit: Int, maxEnemyLimit: Int, enemyLimitPerWave: Int,
  timeBlockSeconds: Int, moraPerTimeBlock: Int, moraPerKill: Int,
  primogemsPerTimeBlock: Int, killBlock: Int, primogemsPerKillBlock: Int,
  completionMora: Int, completionPrimogems: Int
)
object AdventureRules:
  given Encoder[AdventureRules] = deriveEncoder[AdventureRules]
  given Decoder[AdventureRules] = deriveDecoder[AdventureRules]
