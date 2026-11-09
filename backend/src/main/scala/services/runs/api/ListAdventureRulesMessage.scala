package services.runs.api
import cats.effect.{IO,Resource}
import io.circe.parser.decode
import java.sql.Connection
import services.runs.objects.AdventureRules
import services.system.api.NoRequestMessage
final case class ListAdventureRulesMessage() extends NoRequestMessage[AdventureRules]:
  override def plan(connection: Connection): IO[AdventureRules] =
    Resource.fromAutoCloseable(IO.blocking(scala.io.Source.fromResource("adventure-rules.json"))).use(source =>
      IO.blocking(source.mkString).flatMap(json => IO.fromEither(decode[AdventureRules](json)))
    )
