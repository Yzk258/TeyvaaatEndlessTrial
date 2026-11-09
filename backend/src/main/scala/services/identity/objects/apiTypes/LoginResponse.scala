package services.identity.objects.apiTypes
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class LoginResponse(status: services.identity.objects.LoginStatus, session: Option[AuthSession], message: String)
object LoginResponse:
  given Encoder[LoginResponse] = deriveEncoder[LoginResponse]
  given Decoder[LoginResponse] = deriveDecoder[LoginResponse]
