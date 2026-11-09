package services.economy.objects.apiTypes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import io.circe.{Encoder,Decoder,Json}
import io.circe.generic.semiauto.{deriveEncoder,deriveDecoder}
final case class Profile(primogems: Int, mora: Int, intertwinedFates: Int, characters: List[services.characters.objects.OwnedCharacter], pity: Int, runs: Int, weapons: List[services.weapons.objects.OwnedWeapon], equipment: List[services.weapons.objects.Equipment], weaponPity: Int, fourStarPity: Int, weaponFourStarPity: Int)
object Profile:
  given Encoder[Profile] = deriveEncoder[Profile]
  private val currentDecoder: Decoder[Profile] = deriveDecoder[Profile]
  // Existing receipts contain snapshots from before four-star counters / intertwined fates existed.
  given Decoder[Profile] = Decoder.instance(c=>currentDecoder.tryDecode(c.withFocus(_.mapObject(obj=>
    obj.add("intertwinedFates",obj("intertwinedFates").getOrElse(Json.fromInt(0)))
      .add("fourStarPity",obj("fourStarPity").getOrElse(Json.fromInt(0)))
      .add("weaponFourStarPity",obj("weaponFourStarPity").getOrElse(Json.fromInt(0)))
  ))))
