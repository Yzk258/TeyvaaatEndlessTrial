package services.runs.tables.challenge
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object ChallengeTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS run_challenges(run_id TEXT PRIMARY KEY REFERENCES runs(id),definition TEXT NOT NULL)"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s => IO.blocking(s.execute(initializeSql)).void)
