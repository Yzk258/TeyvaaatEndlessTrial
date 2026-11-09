package services.content.objects
import io.circe.{Encoder,Decoder}
enum WeaponStatKind:
  case AttackFlat, AttackPercent, HpFlat, HpPercent, AttackSpeedPercent, AttackRangeFlat
object WeaponStatKind:
  def toString(value: WeaponStatKind): String = value match
    case WeaponStatKind.AttackFlat => "attackFlat"
    case WeaponStatKind.AttackPercent => "attackPercent"
    case WeaponStatKind.HpFlat => "hpFlat"
    case WeaponStatKind.HpPercent => "hpPercent"
    case WeaponStatKind.AttackSpeedPercent => "attackSpeedPercent"
    case WeaponStatKind.AttackRangeFlat => "attackRangeFlat"
  def fromString(value: String): Either[String,WeaponStatKind] = value.trim match
    case "attackFlat" => Right(WeaponStatKind.AttackFlat)
    case "attackPercent" => Right(WeaponStatKind.AttackPercent)
    case "hpFlat" => Right(WeaponStatKind.HpFlat)
    case "hpPercent" => Right(WeaponStatKind.HpPercent)
    case "attackSpeedPercent" => Right(WeaponStatKind.AttackSpeedPercent)
    case "attackRangeFlat" => Right(WeaponStatKind.AttackRangeFlat)
    case other => Left(s"Unsupported WeaponStatKind: $other")
  given Encoder[WeaponStatKind] = Encoder.encodeString.contramap(toString)
  given Decoder[WeaponStatKind] = Decoder.decodeString.emap(fromString)
