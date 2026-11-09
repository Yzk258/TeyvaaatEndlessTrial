package services.economy.tables.wallet
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
object WalletTable:
  private val createSql = """INSERT INTO wallets VALUES (?,1600,5000,10)"""
  def create(connection: Connection, userId: UserId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val getSql = """SELECT primogems,mora,intertwined_fates FROM wallets WHERE user_id=?"""
  def get(connection: Connection, userId: UserId): IO[Wallet] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { require(rows.next());Wallet(rows.getInt(1),rows.getInt(2),rows.getInt(3)) })
    }

  private val adjustSql = """UPDATE wallets SET primogems=primogems+?,mora=mora+?,intertwined_fates=intertwined_fates+? WHERE user_id=?"""
  def adjust(connection: Connection, userId: UserId, gems: Int, mora: Int, fates: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(adjustSql))).use { statement =>
      IO.blocking { statement.setInt(1,gems);statement.setInt(2,mora);statement.setInt(3,fates);statement.setString(4,userId.value) } *> IO.blocking(statement.executeUpdate()).void
    }
