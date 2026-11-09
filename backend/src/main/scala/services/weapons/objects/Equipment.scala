package services.weapons.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class Equipment(characterId: String, weaponId: String)
object Equipment:
  given Encoder[Equipment] = deriveEncoder[Equipment]
  given Decoder[Equipment] = deriveDecoder[Equipment]
