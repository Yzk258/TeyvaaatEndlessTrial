package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WeaponDefinition(id: String, name: String, weapon: WeaponType, symbol: String, mainStat: WeaponStat, subStat: WeaponStat, talent: WeaponTalent, maxLevel: Int, levelUpCost: Int, rarity: Rarity)
object WeaponDefinition:
  given Encoder[WeaponDefinition] = deriveEncoder[WeaponDefinition]
  given Decoder[WeaponDefinition] = deriveDecoder[WeaponDefinition]
