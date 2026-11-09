package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AttackVisual(name: String, style: AttackVisualStyle, color: String)
object AttackVisual:
  given Encoder[AttackVisual] = deriveEncoder[AttackVisual]
  given Decoder[AttackVisual] = deriveDecoder[AttackVisual]
