package services.identity.tables.session
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object SessionTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS login_sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES accounts(user_id),expires_at TIMESTAMPTZ NOT NULL,revoked BOOLEAN NOT NULL DEFAULT false,created_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS sessions_user_idx ON login_sessions(user_id)"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    for
      _ <- create(connection)
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("identity.sessions.v1"))
      _ <- IO.unlessA(applied)(SchemaVersionTable.record(connection,SchemaVersion("identity.sessions.v1")))
    yield ()
