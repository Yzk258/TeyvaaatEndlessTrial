package services.identity.tables.account
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.{Connection,Timestamp}
import java.time.Instant
import services.identity.objects.*
import services.identity.objects.apiTypes.AccountSummary
object AccountTable:
  private val lockUsernameSql = """SELECT pg_advisory_xact_lock(hashtextextended('teyvat-login:' || ?,0))"""
  def lockUsername(connection: Connection, username: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(lockUsernameSql))).use(s=>
      IO.blocking { s.setString(1,username) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(_=>IO.unit)
    )

  private val lockRolesSql = """SELECT pg_advisory_xact_lock(741285931)"""
  def lockRoles(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(lockRolesSql))).use(s=>
      IO.blocking { () } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(_=>IO.unit)
    )

  private val findByUsernameSql = """SELECT user_id,username,password_hash,role FROM accounts WHERE username=?"""
  def findByUsername(connection: Connection, username: String): IO[Option[AccountRecord]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(findByUsernameSql))).use(s=>
      IO.blocking { s.setString(1,username) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { if rows.next() then Some(AccountRecord(UserId(rows.getString(1)),rows.getString(2),rows.getString(3),UserRole.fromString(rows.getString(4)).fold(message=>throw new IllegalArgumentException(message),identity))) else None })
    )

  private val findByUserIdSql = """SELECT user_id,username,password_hash,role FROM accounts WHERE user_id=?"""
  def findByUserId(connection: Connection, userId: UserId): IO[Option[AccountRecord]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(findByUserIdSql))).use(s=>
      IO.blocking { s.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { if rows.next() then Some(AccountRecord(UserId(rows.getString(1)),rows.getString(2),rows.getString(3),UserRole.fromString(rows.getString(4)).fold(message=>throw new IllegalArgumentException(message),identity))) else None })
    )

  private val createSql = """INSERT INTO accounts(user_id,username,password_hash,role) VALUES (?,?,?,?)"""
  def create(connection: Connection, userId: UserId, username: String, passwordHash: String, role: UserRole): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use(s=>
      IO.blocking { s.setString(1,userId.value);s.setString(2,username);s.setString(3,passwordHash);s.setString(4,UserRole.toString(role)) } *> IO.blocking(s.executeUpdate()).void
    )

  private val countAdminsSql = """SELECT count(*) FROM accounts WHERE role='admin'"""
  def countAdmins(connection: Connection): IO[Int] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(countAdminsSql))).use(s=>
      IO.blocking { () } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { require(rows.next());rows.getInt(1) })
    )

  private val setRoleSql = """UPDATE accounts SET role=? WHERE user_id=?"""
  def setRole(connection: Connection, userId: UserId, role: UserRole): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(setRoleSql))).use(s=>
      IO.blocking { s.setString(1,UserRole.toString(role));s.setString(2,userId.value) } *> IO.blocking(s.executeUpdate()).void
    )

  private val listSql = """SELECT a.user_id,a.username,u.nickname,a.role,a.created_at FROM accounts a JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC"""
  def list(connection: Connection): IO[List[AccountSummary]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(listSql))).use(s=>
      IO.blocking { () } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use { rows =>
        def remaining: IO[List[AccountSummary]] = IO.blocking(rows.next()).flatMap {
          case false => IO.pure(Nil)
          case true => IO.blocking(AccountSummary(rows.getString(1),rows.getString(2),rows.getString(3),UserRole.fromString(rows.getString(4)).fold(message=>throw new IllegalArgumentException(message),identity),rows.getTimestamp(5).toInstant)).flatMap(item=>remaining.map(item :: _))
        }
        remaining
      }
    )
