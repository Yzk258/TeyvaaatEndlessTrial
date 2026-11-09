package services.wishes.tables.weaponpity
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object WeaponPityTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS weapon_pity(user_id TEXT PRIMARY KEY REFERENCES users(id),count INT NOT NULL CHECK(count BETWEEN 0 AND 4))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
