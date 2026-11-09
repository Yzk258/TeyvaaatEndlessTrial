package services.runs.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class StageDefinition(id: String, title: String, enemies: Int, mora: Int, primogems: Int)
object StageDefinition:
  given Encoder[StageDefinition] = deriveEncoder[StageDefinition]
  given Decoder[StageDefinition] = deriveDecoder[StageDefinition]
