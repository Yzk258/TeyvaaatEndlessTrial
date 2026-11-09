package services.identity.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class UserRecord(id: UserId, nickname: String)
object UserRecord:
  given Encoder[UserRecord] = deriveEncoder[UserRecord]
  given Decoder[UserRecord] = deriveDecoder[UserRecord]
