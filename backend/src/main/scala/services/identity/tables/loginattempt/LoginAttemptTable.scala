package services.identity.tables.loginattempt
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.{Connection,Timestamp}
import java.time.Instant
import services.identity.objects.*
import services.identity.objects.apiTypes.AccountSummary
object LoginAttemptTable:
  private val getSql = """SELECT failures,last_failed_at,blocked_until FROM login_attempts WHERE username=?"""
  def get(connection: Connection, username: String): IO[Option[LoginAttempt]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use(s=>
      IO.blocking { s.setString(1,username) } *> Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { if rows.next() then Some(LoginAttempt(rows.getInt(1),rows.getTimestamp(2).toInstant,Option(rows.getTimestamp(3)).map(_.toInstant))) else None })
    )

  private val saveSql = """INSERT INTO login_attempts VALUES (?,?,?,?) ON CONFLICT(username) DO UPDATE SET failures=EXCLUDED.failures,last_failed_at=EXCLUDED.last_failed_at,blocked_until=EXCLUDED.blocked_until"""
  def save(connection: Connection, username: String, attempt: LoginAttempt): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(saveSql))).use(s=>
      IO.blocking { s.setString(1,username);s.setInt(2,attempt.failures);s.setTimestamp(3,Timestamp.from(attempt.lastFailedAt));s.setTimestamp(4,attempt.blockedUntil.map(Timestamp.from).orNull) } *> IO.blocking(s.executeUpdate()).void
    )

  private val clearSql = """DELETE FROM login_attempts WHERE username=?"""
  def clear(connection: Connection, username: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(clearSql))).use(s=>
      IO.blocking { s.setString(1,username) } *> IO.blocking(s.executeUpdate()).void
    )
