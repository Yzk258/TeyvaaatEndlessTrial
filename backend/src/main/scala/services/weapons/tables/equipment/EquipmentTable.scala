package services.weapons.tables.equipment
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.characters.objects.CharacterId
import services.weapons.objects.{WeaponId,OwnedWeapon,Equipment}
object EquipmentTable:
  private val listSql = """SELECT character_id,weapon_id FROM weapon_equipment WHERE user_id=? ORDER BY character_id"""
  def list(connection: Connection, userId: UserId): IO[List[Equipment]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(listSql))).use(s =>
      IO.blocking { s.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use { rows =>
        def remaining: IO[List[Equipment]] = IO.blocking(rows.next()).flatMap {
          case false => IO.pure(Nil)
          case true => IO.blocking(Equipment(rows.getString(1),rows.getString(2))).flatMap(item=>remaining.map(item :: _))
        }
        remaining
      }
    )

  private val equipSql = """INSERT INTO weapon_equipment VALUES (?,?,?) ON CONFLICT(user_id,character_id) DO UPDATE SET weapon_id=EXCLUDED.weapon_id"""
  def equip(connection: Connection, userId: UserId, characterId: CharacterId, weaponId: WeaponId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(equipSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setString(2,characterId.value);s.setString(3,weaponId.value) } *> IO.blocking(s.executeUpdate()).void
    )

  private val unequipSql = """DELETE FROM weapon_equipment WHERE user_id=? AND character_id=?"""
  def unequip(connection: Connection, userId: UserId, characterId: CharacterId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(unequipSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setString(2,characterId.value) } *> IO.blocking(s.executeUpdate()).void
    )
