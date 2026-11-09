package services.runs.objects.apiTypes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class RunStart(runId: String, seed: Long, level: Int, stage: Option[services.runs.objects.StageDefinition], character: services.content.objects.CharacterDefinition, equippedWeapon: Option[services.weapons.objects.WeaponLoadout], adventure: Option[services.runs.objects.AdventurePlan] = None)
object RunStart:
  given Encoder[RunStart] = deriveEncoder[RunStart]
  given Decoder[RunStart] = deriveDecoder[RunStart]
