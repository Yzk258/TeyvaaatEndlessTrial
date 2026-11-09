package services.wishes.objects
import io.circe.{Encoder,Decoder}
enum WishBanner:
  case Character, Weapon
object WishBanner:
  def toString(value: WishBanner): String = value match
    case WishBanner.Character => "character"
    case WishBanner.Weapon => "weapon"
  def fromString(value: String): Either[String,WishBanner] = value match
    case "character" => Right(WishBanner.Character)
    case "weapon" => Right(WishBanner.Weapon)
    case other => Left(s"Unsupported banner: $other")
  given Encoder[WishBanner] = Encoder.encodeString.contramap(toString)
  given Decoder[WishBanner] = Decoder.decodeString.emap(fromString)
