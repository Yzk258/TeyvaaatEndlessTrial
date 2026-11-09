package services.weapons.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class OwnedWeapon(id: String, level: Int, copies: Int)
object OwnedWeapon:
  given Encoder[OwnedWeapon] = deriveEncoder[OwnedWeapon]
  given Decoder[OwnedWeapon] = deriveDecoder[OwnedWeapon]
