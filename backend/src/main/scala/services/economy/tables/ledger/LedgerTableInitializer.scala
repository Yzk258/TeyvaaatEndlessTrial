package services.economy.tables.ledger
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object LedgerTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS currency_ledger(id BIGSERIAL PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),gems INT NOT NULL,mora INT NOT NULL,fates INT NOT NULL DEFAULT 0,reason TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now())"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
  private val addHistoryIndexSql = """CREATE INDEX IF NOT EXISTS ledger_user_history_idx ON currency_ledger(user_id,id DESC)"""
  private def addHistoryIndex(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(addHistoryIndexSql)).void)
  private val migrateFatesSql = """ALTER TABLE currency_ledger ADD COLUMN IF NOT EXISTS fates INT NOT NULL DEFAULT 0"""
  private def migrateFates(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(migrateFatesSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    create(connection) *> (for
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("ledger.history-index.v1"))
      _ <- IO.unlessA(applied)(addHistoryIndex(connection) *> SchemaVersionTable.record(connection,SchemaVersion("ledger.history-index.v1")))
      fatesMigrated <- SchemaVersionTable.contains(connection,SchemaVersion("ledger.fates.v1"))
      _ <- IO.unlessA(fatesMigrated)(migrateFates(connection) *> SchemaVersionTable.record(connection,SchemaVersion("ledger.fates.v1")))
    yield ())
