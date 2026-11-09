package services.system.tables.schema
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object SchemaVersionTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS schema_versions(version TEXT PRIMARY KEY,applied_at TIMESTAMPTZ NOT NULL DEFAULT now())"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
