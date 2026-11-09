package services.content.objects
import io.circe.{Encoder,Decoder}
enum AttackStyle:
  case Melee, Ranged
object AttackStyle:
  def toString(value: AttackStyle): String = value match
    case AttackStyle.Melee => "melee"
    case AttackStyle.Ranged => "ranged"
  def fromString(value: String): Either[String,AttackStyle] = value.trim.toLowerCase match
    case "melee" => Right(AttackStyle.Melee)
    case "ranged" => Right(AttackStyle.Ranged)
    case other => Left(s"Unsupported AttackStyle: $other")
  given Encoder[AttackStyle] = Encoder.encodeString.contramap(toString)
  given Decoder[AttackStyle] = Decoder.decodeString.emap(fromString)
