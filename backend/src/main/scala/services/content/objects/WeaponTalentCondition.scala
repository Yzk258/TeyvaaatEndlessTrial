package services.content.objects
import io.circe.{Encoder,Decoder}
enum WeaponTalentCondition:
  case Always, Near, Far, Reaction
object WeaponTalentCondition:
  def toString(value: WeaponTalentCondition): String = value match
    case WeaponTalentCondition.Always => "always"
    case WeaponTalentCondition.Near => "near"
    case WeaponTalentCondition.Far => "far"
    case WeaponTalentCondition.Reaction => "reaction"
  def fromString(value: String): Either[String,WeaponTalentCondition] = value.trim match
    case "always" => Right(WeaponTalentCondition.Always)
    case "near" => Right(WeaponTalentCondition.Near)
    case "far" => Right(WeaponTalentCondition.Far)
    case "reaction" => Right(WeaponTalentCondition.Reaction)
    case other => Left(s"Unsupported WeaponTalentCondition: $other")
  given Encoder[WeaponTalentCondition] = Encoder.encodeString.contramap(toString)
  given Decoder[WeaponTalentCondition] = Decoder.decodeString.emap(fromString)
