package services.wishes.tables.pity
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
object PityTable:
  private val createSql = """INSERT INTO pity_states VALUES (?,0)"""
  def create(connection: Connection, userId: UserId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val getSql = """SELECT count FROM pity_states WHERE user_id=?"""
  def get(connection: Connection, userId: UserId): IO[Int] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { require(rows.next());rows.getInt(1) })
    }

  private val setSql = """UPDATE pity_states SET count=? WHERE user_id=?"""
  def set(connection: Connection, userId: UserId, count: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(setSql))).use { statement =>
      IO.blocking { statement.setInt(1,count);statement.setString(2,userId.value) } *> IO.blocking(statement.executeUpdate()).void
    }
