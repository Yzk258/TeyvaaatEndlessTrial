package services.runs.tables.adventure
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import io.circe.syntax.*
import io.circe.parser.decode
import java.sql.Connection
import services.runs.objects.{RunId,AdventurePlan}
object AdventureTable:
  private val createSql = "INSERT INTO run_adventures(run_id,definition) VALUES (?,?)"
  def create(connection: Connection, runId: RunId, plan: AdventurePlan): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use(s =>
      IO.blocking { s.setString(1,runId.value); s.setString(2,plan.asJson.noSpaces) } *> IO.blocking(s.executeUpdate()).void
    )
  private val getSql = "SELECT definition FROM run_adventures WHERE run_id=?"
  def get(connection: Connection, runId: RunId): IO[Option[AdventurePlan]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use(s =>
      IO.blocking(s.setString(1,runId.value)) *>
        Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows =>
          IO.blocking(if rows.next() then Some(rows.getString(1)) else None).flatMap(_.traverse(value => IO.fromEither(decode[AdventurePlan](value))))
        )
    )
