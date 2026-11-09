package services.wishes.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class WishPity(four: Int, five: Int)
object WishPity:
  given Encoder[WishPity] = deriveEncoder[WishPity]
  given Decoder[WishPity] = deriveDecoder[WishPity]
