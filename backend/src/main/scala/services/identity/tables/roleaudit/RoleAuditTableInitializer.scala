package services.identity.tables.roleaudit
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object RoleAuditTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS role_audit(id BIGSERIAL PRIMARY KEY,actor_id TEXT NOT NULL REFERENCES users(id),target_id TEXT NOT NULL REFERENCES users(id),old_role TEXT NOT NULL,new_role TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now())"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    for
      _ <- create(connection)
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("identity.role-audit.v1"))
      _ <- IO.unlessA(applied)(SchemaVersionTable.record(connection,SchemaVersion("identity.role-audit.v1")))
    yield ()
