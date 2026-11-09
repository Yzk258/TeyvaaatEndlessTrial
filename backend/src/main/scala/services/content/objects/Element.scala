package services.content.objects
import io.circe.{Encoder,Decoder}
enum Element:
  case Cryo, Anemo, Pyro, Electro, Hydro, Dendro, Geo
object Element:
  def toString(value: Element): String = value match
    case Element.Cryo => "cryo"
    case Element.Anemo => "anemo"
    case Element.Pyro => "pyro"
    case Element.Electro => "electro"
    case Element.Hydro => "hydro"
    case Element.Dendro => "dendro"
    case Element.Geo => "geo"
  def fromString(value: String): Either[String,Element] = value.trim.toLowerCase match
    case "cryo" => Right(Element.Cryo)
    case "anemo" => Right(Element.Anemo)
    case "pyro" => Right(Element.Pyro)
    case "electro" => Right(Element.Electro)
    case "hydro" => Right(Element.Hydro)
    case "dendro" => Right(Element.Dendro)
    case "geo" => Right(Element.Geo)
    case other => Left(s"Unsupported Element: $other")
  given Encoder[Element] = Encoder.encodeString.contramap(toString)
  given Decoder[Element] = Decoder.decodeString.emap(fromString)
