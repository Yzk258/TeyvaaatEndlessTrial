package services.content.api
import cats.effect.{IO,Resource}
import java.sql.Connection
import io.circe.parser.decode
import services.system.api.NoRequestMessage
import services.content.objects.WeaponDefinition
import services.system.objects.DomainError
final case class ListWeaponsMessage() extends NoRequestMessage[List[WeaponDefinition]]:
  override def plan(connection: Connection): IO[List[WeaponDefinition]] =
    Resource.fromAutoCloseable(IO.blocking(scala.io.Source.fromResource("weapons.json"))).use(source =>
      IO.blocking(source.mkString).flatMap(json => IO.fromEither(decode[List[WeaponDefinition]](json))).flatMap(definitions =>
        IO.raiseWhen(definitions.isEmpty || definitions.map(_.id).distinct.size!=definitions.size ||
          definitions.exists(w => w.id.isEmpty || w.maxLevel<1 || w.levelUpCost<0 ||
            w.mainStat.base<0 || w.mainStat.growth<0 || w.subStat.base<0 || w.subStat.growth<0 ||
            w.talent.threshold<0 || w.talent.damageBonusPercent<0)
        )(DomainError("武器配置无效")).as(definitions)
      )
    )
