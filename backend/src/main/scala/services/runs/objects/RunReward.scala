package services.runs.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class RunReward(mora: Int, primogems: Int)
object RunReward:
  given Encoder[RunReward] = deriveEncoder[RunReward]
  given Decoder[RunReward] = deriveDecoder[RunReward]
