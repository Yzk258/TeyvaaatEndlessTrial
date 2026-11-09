package services.content.objects
import io.circe.{Encoder,Decoder}
enum WeaponType:
  case Claymore, Sword, Catalyst, Bow, Polearm
object WeaponType:
  def toString(value: WeaponType): String = value match
    case WeaponType.Claymore => "claymore"
    case WeaponType.Sword => "sword"
    case WeaponType.Catalyst => "catalyst"
    case WeaponType.Bow => "bow"
    case WeaponType.Polearm => "polearm"
  def fromString(value: String): Either[String,WeaponType] = value.trim.toLowerCase match
    case "claymore" => Right(WeaponType.Claymore)
    case "sword" => Right(WeaponType.Sword)
    case "catalyst" => Right(WeaponType.Catalyst)
    case "bow" => Right(WeaponType.Bow)
    case "polearm" => Right(WeaponType.Polearm)
    case other => Left(s"Unsupported WeaponType: $other")
  given Encoder[WeaponType] = Encoder.encodeString.contramap(toString)
  given Decoder[WeaponType] = Decoder.decodeString.emap(fromString)
