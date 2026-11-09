package services.identity.tables.session
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.{Connection,Timestamp}
import java.time.Instant
import services.identity.objects.*
import services.identity.objects.apiTypes.AccountSummary
object SessionTable:
  private val createSql = """INSERT INTO login_sessions(token_hash,user_id,expires_at) VALUES (?,?,?)"""
  def create(connection: Connection, userId: UserId, tokenHash: String, expiresAt: Instant): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use(s=>
      IO.blocking { s.setString(1,tokenHash);s.setString(2,userId.value);s.setTimestamp(3,Timestamp.from(expiresAt)) } *> IO.blocking(s.executeUpdate()).void
    )

  private val resolveSql = """SELECT user_id FROM login_sessions WHERE token_hash=? AND revoked=false AND expires_at>?"""
  def resolve(connection: Connection, tokenHash: String, now: Instant): IO[Option[UserId]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(resolveSql))).use(s=>
      IO.blocking { s.setString(1,tokenHash);s.setTimestamp(2,Timestamp.from(now)) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { if rows.next() then Some(UserId(rows.getString(1))) else None })
    )

  private val revokeAllSql = """UPDATE login_sessions SET revoked=true WHERE user_id=?"""
  def revokeAll(connection: Connection, userId: UserId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(revokeAllSql))).use(s=>
      IO.blocking { s.setString(1,userId.value) } *> IO.blocking(s.executeUpdate()).void
    )
