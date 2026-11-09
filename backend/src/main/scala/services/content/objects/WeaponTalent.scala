package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WeaponTalent(name: String, description: String, condition: WeaponTalentCondition, threshold: Double, damageBonusPercent: Double)
object WeaponTalent:
  given Encoder[WeaponTalent] = deriveEncoder[WeaponTalent]
  given Decoder[WeaponTalent] = deriveDecoder[WeaponTalent]
