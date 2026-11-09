package services.runs.objects
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class RunRecord(id: String, characterId: String, seed: Long, level: Int, status: RunStatus, ticks: Int, kills: Int, elapsed: Long)
object RunRecord:
  given Encoder[RunRecord] = deriveEncoder[RunRecord]
  given Decoder[RunRecord] = deriveDecoder[RunRecord]
