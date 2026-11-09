package services.identity.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class UserId(value: String)
object UserId:
  given Encoder[UserId] = deriveEncoder[UserId]
  given Decoder[UserId] = deriveDecoder[UserId]
