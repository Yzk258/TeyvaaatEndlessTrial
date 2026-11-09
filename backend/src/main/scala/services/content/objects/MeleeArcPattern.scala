package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class MeleeArcPattern(angleDegrees: Double)
object MeleeArcPattern:
  given Encoder[MeleeArcPattern] = deriveEncoder[MeleeArcPattern]
  given Decoder[MeleeArcPattern] = deriveDecoder[MeleeArcPattern]
