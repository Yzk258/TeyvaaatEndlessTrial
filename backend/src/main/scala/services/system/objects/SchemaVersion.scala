package services.system.objects
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class SchemaVersion(value: String)
object SchemaVersion:
  given Encoder[SchemaVersion] = deriveEncoder[SchemaVersion]
  given Decoder[SchemaVersion] = deriveDecoder[SchemaVersion]
