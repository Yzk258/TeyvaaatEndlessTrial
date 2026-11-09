package services.runs.tables.run
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.runs.objects.RunId
/** Only ages freshly created test runs; never included in production classes. */
object RunFixtureTable:
  private val ageSql = "UPDATE runs SET created_at=now()-(? * interval '1 second') WHERE user_id=? AND id=?"
  def age(connection: Connection, user: UserId, run: RunId, seconds: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(ageSql))).use(s =>
      IO.blocking { s.setInt(1,seconds);s.setString(2,user.value);s.setString(3,run.value) } *> IO.blocking(s.executeUpdate()).void
    )
