package services.identity.objects
import io.circe.{Encoder,Decoder}
enum UserRole:
  case User, Admin
object UserRole:
  def toString(value: UserRole): String = value match
    case UserRole.User => "user"
    case UserRole.Admin => "admin"
  def fromString(value: String): Either[String,UserRole] = value match
    case "user" => Right(UserRole.User)
    case "admin" => Right(UserRole.Admin)
    case other => Left(s"Unsupported UserRole: $other")
  given Encoder[UserRole] = Encoder.encodeString.contramap(toString)
  given Decoder[UserRole] = Decoder.decodeString.emap(fromString)
