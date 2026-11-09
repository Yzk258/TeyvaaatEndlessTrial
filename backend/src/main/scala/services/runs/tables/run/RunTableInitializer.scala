package services.runs.tables.run
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.tables.schema.SchemaVersionTable
import services.system.objects.SchemaVersion
object RunTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),character_id TEXT NOT NULL,seed BIGINT NOT NULL,level INT NOT NULL,status TEXT NOT NULL CHECK(status IN ('active','settled','abandoned')),ticks INT NOT NULL DEFAULT 0,kills INT NOT NULL DEFAULT 0,created_at TIMESTAMPTZ DEFAULT now())"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
  private val migrateStatusSql = """ALTER TABLE runs DROP CONSTRAINT IF EXISTS runs_status_check; ALTER TABLE runs ADD CONSTRAINT runs_status_check CHECK(status IN ('active','settled','abandoned'))"""
  private def migrateStatus(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s => IO.blocking(s.execute(migrateStatusSql)).void)
  private val addHistoryIndexSql = """CREATE INDEX IF NOT EXISTS runs_user_history_idx ON runs(user_id,created_at DESC)"""
  private def addHistoryIndex(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(addHistoryIndexSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    create(connection) *> (for
      migrated <- SchemaVersionTable.contains(connection,SchemaVersion("runs.status.v2"))
      _ <- IO.unlessA(migrated)(migrateStatus(connection) *> SchemaVersionTable.record(connection,SchemaVersion("runs.status.v2")))
      indexed <- SchemaVersionTable.contains(connection,SchemaVersion("runs.history-index.v1"))
      _ <- IO.unlessA(indexed)(addHistoryIndex(connection) *> SchemaVersionTable.record(connection,SchemaVersion("runs.history-index.v1")))
    yield ())
