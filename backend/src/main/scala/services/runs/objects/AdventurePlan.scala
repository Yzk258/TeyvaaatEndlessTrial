package services.runs.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AdventurePlan(settings: AdventureSettings, rules: AdventureRules)
object AdventurePlan:
  given Encoder[AdventurePlan] = deriveEncoder[AdventurePlan]
  given Decoder[AdventurePlan] = deriveDecoder[AdventurePlan]
