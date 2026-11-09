package services.wishes.tables.weaponpity
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.characters.objects.CharacterId
import services.weapons.objects.{WeaponId,OwnedWeapon,Equipment}
object WeaponPityTable:
  private val getSql = """SELECT count FROM weapon_pity WHERE user_id=?"""
  def get(connection: Connection, userId: UserId): IO[Int] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use(s =>
      IO.blocking { s.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows => IO.blocking { if rows.next() then rows.getInt(1) else 0 })
    )

  private val setSql = """INSERT INTO weapon_pity VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET count=EXCLUDED.count"""
  def set(connection: Connection, userId: UserId, count: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(setSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setInt(2,count) } *> IO.blocking(s.executeUpdate()).void
    )
