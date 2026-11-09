package services.characters.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class OwnedCharacter(id: String, level: Int, copies: Int)
object OwnedCharacter:
  given Encoder[OwnedCharacter] = deriveEncoder[OwnedCharacter]
  given Decoder[OwnedCharacter] = deriveDecoder[OwnedCharacter]
