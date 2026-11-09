package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AreaPattern(splashRadius: Double)
object AreaPattern:
  given Encoder[AreaPattern] = deriveEncoder[AreaPattern]
  given Decoder[AreaPattern] = deriveDecoder[AreaPattern]
