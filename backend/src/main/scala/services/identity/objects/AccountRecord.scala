package services.identity.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class AccountRecord(userId: UserId, username: String, passwordHash: String, role: UserRole)
object AccountRecord:
  given Encoder[AccountRecord] = deriveEncoder[AccountRecord]
  given Decoder[AccountRecord] = deriveDecoder[AccountRecord]
