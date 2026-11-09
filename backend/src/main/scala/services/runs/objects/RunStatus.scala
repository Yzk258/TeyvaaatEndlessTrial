package services.runs.objects
import io.circe.{Encoder,Decoder}
enum RunStatus:
  case Active, Settled, Abandoned
object RunStatus:
  def toString(value: RunStatus): String = value match
    case RunStatus.Abandoned => "abandoned"
    case RunStatus.Active => "active"
    case RunStatus.Settled => "settled"
  def fromString(value: String): Either[String,RunStatus] = value.trim.toLowerCase match
    case "abandoned" => Right(RunStatus.Abandoned)
    case "active" => Right(RunStatus.Active)
    case "settled" => Right(RunStatus.Settled)
    case other => Left(s"Unsupported RunStatus: $other")
  given Encoder[RunStatus] = Encoder.encodeString.contramap(toString)
  given Decoder[RunStatus] = Decoder.decodeString.emap(fromString)
