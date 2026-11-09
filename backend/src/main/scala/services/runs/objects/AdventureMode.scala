package services.runs.objects
import io.circe.{Encoder,Decoder}
enum AdventureMode:
  case Timed, Endless
object AdventureMode:
  given Encoder[AdventureMode] = Encoder.encodeString.contramap {
    case AdventureMode.Timed => "timed"
    case AdventureMode.Endless => "endless"
  }
  given Decoder[AdventureMode] = Decoder.decodeString.emap {
    case "timed" => Right(AdventureMode.Timed)
    case "endless" => Right(AdventureMode.Endless)
    case _ => Left("冒险模式无效")
  }
