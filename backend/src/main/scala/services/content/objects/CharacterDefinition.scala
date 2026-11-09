package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class CharacterDefinition(id: String, name: String, title: String, element: Element, weapon: WeaponType, attackStyle: AttackStyle, color: String, symbol: String, baseAttack: Int, attackGrowth: Int, baseHp: Int, hpGrowth: Int, attackRange: Int, attackIntervalTicks: Int, maxLevel: Int, levelUpCost: Int, inStandardBanner: Boolean, attackPattern: AttackPattern, attackVisual: AttackVisual, rarity: Rarity)
object CharacterDefinition:
  given Encoder[CharacterDefinition] = deriveEncoder[CharacterDefinition]
  given Decoder[CharacterDefinition] = deriveDecoder[CharacterDefinition]
