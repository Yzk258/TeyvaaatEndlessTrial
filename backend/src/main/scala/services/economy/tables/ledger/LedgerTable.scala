package services.economy.tables.ledger
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
object LedgerTable:
  private val appendSql = """INSERT INTO currency_ledger(user_id,gems,mora,fates,reason) VALUES (?,?,?,?,?)"""
  def append(connection: Connection, userId: UserId, gems: Int, mora: Int, fates: Int, reason: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(appendSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setInt(2,gems);statement.setInt(3,mora);statement.setInt(4,fates);statement.setString(5,reason) } *> IO.blocking(statement.executeUpdate()).void
    }
