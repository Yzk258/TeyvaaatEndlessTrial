package services.identity.objects.apiTypes
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AccountSummary(id: String, username: String, nickname: String, role: services.identity.objects.UserRole, createdAt: java.time.Instant)
object AccountSummary:
  given Encoder[AccountSummary] = deriveEncoder[AccountSummary]
  given Decoder[AccountSummary] = deriveDecoder[AccountSummary]
