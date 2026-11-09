package services.wishes.objects.apiTypes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WishResult(reward: services.wishes.objects.WishReward, duplicate: Boolean, profile: services.economy.objects.apiTypes.Profile)
object WishResult:
  given Encoder[WishResult] = deriveEncoder[WishResult]
  given Decoder[WishResult] = deriveDecoder[WishResult]
