package services.content.objects
import io.circe.{Encoder,Decoder,Json}
import io.circe.syntax.*
enum AttackPattern:
  case Projectile(config: ProjectilePattern)
  case MeleeArc(config: MeleeArcPattern)
  case Area(config: AreaPattern)
object AttackPattern:
  given Encoder[AttackPattern] = Encoder.instance {
    case AttackPattern.Projectile(value) => value.asJson.deepMerge(Json.obj("kind" -> Json.fromString("projectile")))
    case AttackPattern.MeleeArc(value) => value.asJson.deepMerge(Json.obj("kind" -> Json.fromString("meleeArc")))
    case AttackPattern.Area(value) => value.asJson.deepMerge(Json.obj("kind" -> Json.fromString("area")))
  }
  given Decoder[AttackPattern] = Decoder.instance(cursor =>
    cursor.get[String]("kind").flatMap {
      case "projectile" => cursor.as[ProjectilePattern].map(AttackPattern.Projectile.apply)
      case "meleeArc" => cursor.as[MeleeArcPattern].map(AttackPattern.MeleeArc.apply)
      case "area" => cursor.as[AreaPattern].map(AttackPattern.Area.apply)
      case other => Left(io.circe.DecodingFailure(s"Unsupported AttackPattern: $other",cursor.history))
    }
  )
