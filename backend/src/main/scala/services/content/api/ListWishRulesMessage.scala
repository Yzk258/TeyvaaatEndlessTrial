package services.content.api
import cats.effect.{IO,Resource}
import io.circe.parser.decode
import java.sql.Connection
import services.content.objects.WishRules
import services.system.api.NoRequestMessage
import services.system.objects.DomainError
final case class ListWishRulesMessage() extends NoRequestMessage[WishRules]:
  override def plan(connection: Connection): IO[WishRules] =
    Resource.fromAutoCloseable(IO.blocking(scala.io.Source.fromResource("wish-rules.json"))).use(source =>
      IO.blocking(source.mkString).flatMap(json=>IO.fromEither(decode[WishRules](json))).flatMap(rules=>
        IO.raiseWhen(rules.cost<=0 || List(rules.character,rules.weapon).exists(r=>
          r.fiveBaseRate<=0 || r.fourBaseRate<=0 || r.fiveBaseRate+r.fourBaseRate>=1 ||
          r.fiveHardPity<2 || r.fiveHardPity>90 || r.fourHardPity!=10 ||
          r.fiveSoftStart<1 || r.fiveSoftStart>r.fiveHardPity || r.fourSoftStart<1 || r.fourSoftStart>r.fourHardPity ||
          r.fiveSoftStep<0 || r.fourSoftStep<0
        ))(DomainError("祈愿概率配置无效")).as(rules)
      )
    )
