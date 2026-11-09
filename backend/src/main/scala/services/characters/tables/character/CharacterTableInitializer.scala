package services.characters.tables.character
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object CharacterTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS characters(user_id TEXT REFERENCES users(id),id TEXT NOT NULL,level INT NOT NULL CHECK(level BETWEEN 1 AND 20),copies INT NOT NULL DEFAULT 0,PRIMARY KEY(user_id,id))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(statement => IO.blocking(statement.execute(initializeSql)).void)
