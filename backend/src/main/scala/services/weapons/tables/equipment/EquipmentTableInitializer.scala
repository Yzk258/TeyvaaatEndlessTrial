package services.weapons.tables.equipment
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object EquipmentTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS weapon_equipment(user_id TEXT NOT NULL,character_id TEXT NOT NULL,weapon_id TEXT NOT NULL,PRIMARY KEY(user_id,character_id),UNIQUE(user_id,weapon_id),FOREIGN KEY(user_id,character_id) REFERENCES characters(user_id,id),FOREIGN KEY(user_id,weapon_id) REFERENCES owned_weapons(user_id,id))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
