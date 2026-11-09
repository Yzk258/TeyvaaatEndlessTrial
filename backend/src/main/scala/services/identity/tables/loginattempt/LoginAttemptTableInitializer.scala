package services.identity.tables.loginattempt
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object LoginAttemptTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS login_attempts(username TEXT PRIMARY KEY,failures INT NOT NULL CHECK(failures>=0),last_failed_at TIMESTAMPTZ NOT NULL,blocked_until TIMESTAMPTZ)"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    for
      _ <- create(connection)
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("identity.login-attempts.v1"))
      _ <- IO.unlessA(applied)(SchemaVersionTable.record(connection,SchemaVersion("identity.login-attempts.v1")))
    yield ()
