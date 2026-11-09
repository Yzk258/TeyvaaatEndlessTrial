package services.content.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WishBannerRules(fiveBaseRate: Double, fourBaseRate: Double, fiveHardPity: Int, fourHardPity: Int, fiveSoftStart: Int, fiveSoftStep: Double, fourSoftStart: Int, fourSoftStep: Double)
object WishBannerRules:
  given Encoder[WishBannerRules] = deriveEncoder[WishBannerRules]
  given Decoder[WishBannerRules] = deriveDecoder[WishBannerRules]
