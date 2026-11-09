package services.identity.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class LoginAttempt(failures: Int, lastFailedAt: java.time.Instant, blockedUntil: Option[java.time.Instant])
object LoginAttempt:
  given Encoder[LoginAttempt] = deriveEncoder[LoginAttempt]
  given Decoder[LoginAttempt] = deriveDecoder[LoginAttempt]
