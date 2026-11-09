package services.identity.tables.user
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.characters.objects.{CharacterId,OwnedCharacter}
import services.economy.objects.Wallet
import services.runs.objects.{RunId,RunRecord}
object UserTable:
  private val createSql = """INSERT INTO users(id,token,nickname) VALUES (?,?,?)"""
  def create(connection: Connection, userId: UserId, token: String, nickname: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,token);statement.setString(3,nickname) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val resolveSql = """SELECT id FROM users WHERE token=? AND NOT EXISTS (SELECT 1 FROM accounts WHERE accounts.user_id=users.id)"""
  def resolve(connection: Connection, token: String): IO[Option[UserId]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(resolveSql))).use { statement =>
      IO.blocking { statement.setString(1,token) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { if rows.next() then Some(UserId(rows.getString(1))) else None })
    }

  private val lockSql = """SELECT id FROM users WHERE id=? FOR UPDATE"""
  def lock(connection: Connection, userId: UserId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(lockSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { require(rows.next()); () })
    }

  private val findSql = """SELECT id,nickname FROM users WHERE id=?"""
  def find(connection: Connection, userId: UserId): IO[Option[services.identity.objects.UserRecord]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(findSql))).use(s=>
      IO.blocking(s.setString(1,userId.value)) *>
        Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking(if rows.next() then Some(services.identity.objects.UserRecord(UserId(rows.getString(1)),rows.getString(2))) else None))
    )
  private val renameSql = """UPDATE users SET nickname=? WHERE id=?"""
  def rename(connection: Connection, userId: UserId, nickname: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(renameSql))).use(s=>
      IO.blocking { s.setString(1,nickname);s.setString(2,userId.value) } *> IO.blocking(s.executeUpdate()).void
    )
  private val rotateLegacyTokenSql = """UPDATE users SET token=? WHERE id=?"""
  def rotateLegacyToken(connection: Connection, userId: UserId, token: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(rotateLegacyTokenSql))).use(s=>
      IO.blocking { s.setString(1,token);s.setString(2,userId.value) } *> IO.blocking(s.executeUpdate()).void
    )
