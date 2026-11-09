package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WeaponStat(kind: WeaponStatKind, base: Double, growth: Double)
object WeaponStat:
  given Encoder[WeaponStat] = deriveEncoder[WeaponStat]
  given Decoder[WeaponStat] = deriveDecoder[WeaponStat]
