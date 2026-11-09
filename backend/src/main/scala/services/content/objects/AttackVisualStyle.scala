package services.content.objects
import io.circe.{Encoder,Decoder}
enum AttackVisualStyle:
  case Arrow, Orb, Slash, Burst
object AttackVisualStyle:
  def toString(value: AttackVisualStyle): String = value match
    case AttackVisualStyle.Arrow => "arrow"
    case AttackVisualStyle.Orb => "orb"
    case AttackVisualStyle.Slash => "slash"
    case AttackVisualStyle.Burst => "burst"
  def fromString(value: String): Either[String,AttackVisualStyle] = value match
    case "arrow" => Right(AttackVisualStyle.Arrow)
    case "orb" => Right(AttackVisualStyle.Orb)
    case "slash" => Right(AttackVisualStyle.Slash)
    case "burst" => Right(AttackVisualStyle.Burst)
    case other => Left(s"Unsupported AttackVisualStyle: $other")
  given Encoder[AttackVisualStyle] = Encoder.encodeString.contramap(toString)
  given Decoder[AttackVisualStyle] = Decoder.decodeString.emap(fromString)
