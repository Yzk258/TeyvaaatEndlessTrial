package services.weapons.tables.weapon
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.characters.objects.CharacterId
import services.weapons.objects.{WeaponId,OwnedWeapon,Equipment}
object WeaponTable:
  private val listSql = """SELECT id,level,copies FROM owned_weapons WHERE user_id=? ORDER BY id"""
  def list(connection: Connection, userId: UserId): IO[List[OwnedWeapon]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(listSql))).use(s =>
      IO.blocking { s.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use { rows =>
        def remaining: IO[List[OwnedWeapon]] = IO.blocking(rows.next()).flatMap {
          case false => IO.pure(Nil)
          case true => IO.blocking(OwnedWeapon(rows.getString(1),rows.getInt(2),rows.getInt(3))).flatMap(item=>remaining.map(item :: _))
        }
        remaining
      }
    )

  private val grantSql = """INSERT INTO owned_weapons VALUES (?,?,1,0) ON CONFLICT(user_id,id) DO UPDATE SET copies=owned_weapons.copies+1"""
  def grant(connection: Connection, userId: UserId, weaponId: WeaponId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(grantSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setString(2,weaponId.value) } *> IO.blocking(s.executeUpdate()).void
    )

  private val levelUpSql = """UPDATE owned_weapons SET level=level+1 WHERE user_id=? AND id=?"""
  def levelUp(connection: Connection, userId: UserId, weaponId: WeaponId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(levelUpSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setString(2,weaponId.value) } *> IO.blocking(s.executeUpdate()).void
    )
