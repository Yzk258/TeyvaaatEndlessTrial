package services.identity.objects
import io.circe.{Encoder,Decoder}
enum LoginStatus:
  case Authenticated, Invalid, Locked
object LoginStatus:
  def toString(value: LoginStatus): String = value match
    case LoginStatus.Authenticated => "authenticated"
    case LoginStatus.Invalid => "invalid"
    case LoginStatus.Locked => "locked"
  def fromString(value: String): Either[String,LoginStatus] = value match
    case "authenticated" => Right(LoginStatus.Authenticated)
    case "invalid" => Right(LoginStatus.Invalid)
    case "locked" => Right(LoginStatus.Locked)
    case other => Left(s"Unsupported LoginStatus: $other")
  given Encoder[LoginStatus] = Encoder.encodeString.contramap(toString)
  given Decoder[LoginStatus] = Decoder.decodeString.emap(fromString)
