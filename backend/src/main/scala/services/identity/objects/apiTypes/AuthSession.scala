package services.identity.objects.apiTypes
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AuthSession(token: String, expiresAt: java.time.Instant, user: CurrentUser)
object AuthSession:
  given Encoder[AuthSession] = deriveEncoder[AuthSession]
  given Decoder[AuthSession] = deriveDecoder[AuthSession]
