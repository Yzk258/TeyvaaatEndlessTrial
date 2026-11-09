package services.weapons.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WeaponLoadout(definition: services.content.objects.WeaponDefinition, level: Int)
object WeaponLoadout:
  given Encoder[WeaponLoadout] = deriveEncoder[WeaponLoadout]
  given Decoder[WeaponLoadout] = deriveDecoder[WeaponLoadout]
