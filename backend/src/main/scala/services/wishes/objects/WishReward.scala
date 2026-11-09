package services.wishes.objects
import io.circe.{Encoder,Decoder,Json,DecodingFailure}
import io.circe.syntax.*
import services.content.objects.Rarity
enum WishReward:
  case Character(id: String, rarity: Rarity)
  case Weapon(id: String, rarity: Rarity)
object WishReward:
  given Encoder[WishReward] = Encoder.instance {
    case WishReward.Character(id,rarity) => Json.obj("kind"->Json.fromString("character"),"id"->Json.fromString(id),"rarity"->rarity.asJson)
    case WishReward.Weapon(id,rarity) => Json.obj("kind"->Json.fromString("weapon"),"id"->Json.fromString(id),"rarity"->rarity.asJson)
  }
  given Decoder[WishReward] = Decoder.instance(c=>for
    kind <- c.get[String]("kind")
    id <- c.get[String]("id")
    rarity <- c.get[Rarity]("rarity")
    reward <- kind match
      case "character" if rarity!=Rarity.Three => Right(WishReward.Character(id,rarity))
      case "weapon" => Right(WishReward.Weapon(id,rarity))
      case _ => Left(DecodingFailure("无效祈愿奖励",c.history))
  yield reward)
