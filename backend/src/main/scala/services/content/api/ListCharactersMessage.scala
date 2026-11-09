package services.content.api
import cats.effect.{IO,Resource}
import java.sql.Connection
import io.circe.parser.decode
import services.system.api.NoRequestMessage
import services.content.objects.{CharacterDefinition,Rarity}
import services.system.objects.DomainError
import services.content.utils.validAttackPattern
final case class ListCharactersMessage() extends NoRequestMessage[List[CharacterDefinition]]:
  override def plan(connection: Connection): IO[List[CharacterDefinition]] =
    Resource.fromAutoCloseable(IO.blocking(scala.io.Source.fromResource("characters.json"))).use(source =>
      IO.blocking(source.mkString).flatMap(json => IO.fromEither(decode[List[CharacterDefinition]](json))).flatMap(definitions =>
        IO.raiseWhen(definitions.isEmpty || definitions.map(_.id).distinct.size!=definitions.size ||
          definitions.exists(c => c.rarity==Rarity.Three || !validAttackPattern(c.attackPattern) || c.id.isEmpty || c.baseAttack<=0 || c.baseHp<=0 || c.attackGrowth<0 || c.hpGrowth<0 || c.attackRange<=0 || c.attackIntervalTicks<=0 || c.maxLevel<1 || c.levelUpCost<0)
        )(DomainError("角色配置无效")) .as(definitions)
      )
    )
