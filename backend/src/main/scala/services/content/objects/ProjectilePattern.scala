package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class ProjectilePattern(speed: Double, radius: Double, pierce: Int)
object ProjectilePattern:
  given Encoder[ProjectilePattern] = deriveEncoder[ProjectilePattern]
  given Decoder[ProjectilePattern] = deriveDecoder[ProjectilePattern]
