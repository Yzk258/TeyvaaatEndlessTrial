package services.runs.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AdventureSettings(mode: AdventureMode, durationSeconds: Option[Int])
object AdventureSettings:
  given Encoder[AdventureSettings] = deriveEncoder[AdventureSettings]
  given Decoder[AdventureSettings] = deriveDecoder[AdventureSettings]
