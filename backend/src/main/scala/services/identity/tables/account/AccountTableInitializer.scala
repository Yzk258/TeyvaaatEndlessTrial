package services.identity.tables.account
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object AccountTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS accounts(user_id TEXT PRIMARY KEY REFERENCES users(id),username TEXT NOT NULL UNIQUE CHECK(username ~ '^[a-z0-9_]{3,24}$'),password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('user','admin')),created_at TIMESTAMPTZ NOT NULL DEFAULT now())"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    for
      _ <- create(connection)
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("identity.accounts.v1"))
      _ <- IO.unlessA(applied)(SchemaVersionTable.record(connection,SchemaVersion("identity.accounts.v1")))
    yield ()
