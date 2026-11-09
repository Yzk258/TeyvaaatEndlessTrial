package services.characters.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class CharacterId(value: String)
object CharacterId:
  given Encoder[CharacterId] = deriveEncoder[CharacterId]
  given Decoder[CharacterId] = deriveDecoder[CharacterId]
