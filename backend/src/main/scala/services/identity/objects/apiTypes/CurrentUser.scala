package services.identity.objects.apiTypes
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class CurrentUser(id: String, username: Option[String], nickname: String, role: services.identity.objects.UserRole, isGuest: Boolean)
object CurrentUser:
  given Encoder[CurrentUser] = deriveEncoder[CurrentUser]
  given Decoder[CurrentUser] = deriveDecoder[CurrentUser]
