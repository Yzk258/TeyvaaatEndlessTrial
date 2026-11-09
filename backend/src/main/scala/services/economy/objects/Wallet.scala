package services.economy.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class Wallet(primogems: Int, mora: Int, intertwinedFates: Int)
object Wallet:
  given Encoder[Wallet] = deriveEncoder[Wallet]
  given Decoder[Wallet] = deriveDecoder[Wallet]
