package services.economy.tables.wallet
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.tables.schema.SchemaVersionTable
import services.system.objects.SchemaVersion
object WalletTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS wallets(user_id TEXT PRIMARY KEY REFERENCES users(id),primogems INT NOT NULL CHECK(primogems>=0),mora INT NOT NULL CHECK(mora>=0),intertwined_fates INT NOT NULL CHECK(intertwined_fates>=0))"""
  private def create(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
  private val migrateFatesSql = """ALTER TABLE wallets ADD COLUMN IF NOT EXISTS intertwined_fates INT NOT NULL DEFAULT 0"""
  private def migrateFates(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s => IO.blocking(s.execute(migrateFatesSql)).void)
  def initialize(connection: Connection): IO[Unit] =
    create(connection) *> (for
      migrated <- SchemaVersionTable.contains(connection,SchemaVersion("wallet.fates.v1"))
      _ <- IO.unlessA(migrated)(migrateFates(connection) *> SchemaVersionTable.record(connection,SchemaVersion("wallet.fates.v1")))
    yield ())
