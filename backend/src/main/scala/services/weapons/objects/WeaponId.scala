package services.weapons.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WeaponId(value: String)
object WeaponId:
  given Encoder[WeaponId] = deriveEncoder[WeaponId]
  given Decoder[WeaponId] = deriveDecoder[WeaponId]
