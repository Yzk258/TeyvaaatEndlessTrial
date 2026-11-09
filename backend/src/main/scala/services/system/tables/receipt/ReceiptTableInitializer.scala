package services.system.tables.receipt
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.SchemaVersionTable
object ReceiptTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS operation_receipts(user_id TEXT REFERENCES users(id),request_id TEXT NOT NULL,operation TEXT NOT NULL,fingerprint TEXT NOT NULL,response TEXT NOT NULL,PRIMARY KEY(user_id,request_id))"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
  private val addAuditSql = """ALTER TABLE operation_receipts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(); CREATE INDEX IF NOT EXISTS receipt_user_history_idx ON operation_receipts(user_id,created_at DESC)"""
  private def addAudit(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(addAuditSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    create(connection) *> (for
      applied <- SchemaVersionTable.contains(connection,SchemaVersion("receipts.audit.v1"))
      _ <- IO.unlessA(applied)(addAudit(connection) *> SchemaVersionTable.record(connection,SchemaVersion("receipts.audit.v1")))
    yield ())
