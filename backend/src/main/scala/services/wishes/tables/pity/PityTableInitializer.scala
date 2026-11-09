package services.wishes.tables.pity
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object PityTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS pity_states(user_id TEXT PRIMARY KEY REFERENCES users(id),count INT NOT NULL CHECK(count BETWEEN 0 AND 4))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
