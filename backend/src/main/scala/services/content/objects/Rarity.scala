package services.content.objects
import io.circe.{Encoder,Decoder}
enum Rarity:
  case Three, Four, Five
object Rarity:
  def toInt(value: Rarity): Int = value match
    case Rarity.Three => 3
    case Rarity.Four => 4
    case Rarity.Five => 5
  def fromInt(value: Int): Either[String,Rarity] = value match
    case 3 => Right(Rarity.Three)
    case 4 => Right(Rarity.Four)
    case 5 => Right(Rarity.Five)
    case other => Left(s"Unsupported rarity: $other")
  given Encoder[Rarity] = Encoder.encodeInt.contramap(toInt)
  given Decoder[Rarity] = Decoder.decodeInt.emap(fromInt)
