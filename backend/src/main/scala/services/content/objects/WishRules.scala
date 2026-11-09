package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WishRules(cost: Int, character: WishBannerRules, weapon: WishBannerRules)
object WishRules:
  given Encoder[WishRules] = deriveEncoder[WishRules]
  given Decoder[WishRules] = deriveDecoder[WishRules]
