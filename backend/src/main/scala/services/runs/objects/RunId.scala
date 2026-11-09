package services.runs.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class RunId(value: String)
object RunId:
  given Encoder[RunId] = deriveEncoder[RunId]
  given Decoder[RunId] = deriveDecoder[RunId]
