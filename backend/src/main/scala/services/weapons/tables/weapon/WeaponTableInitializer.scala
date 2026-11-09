package services.weapons.tables.weapon
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object WeaponTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS owned_weapons(user_id TEXT REFERENCES users(id),id TEXT NOT NULL,level INT NOT NULL CHECK(level BETWEEN 1 AND 100),copies INT NOT NULL DEFAULT 0 CHECK(copies>=0),PRIMARY KEY(user_id,id))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
