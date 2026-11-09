package services.system.tables.receipt
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
object ReceiptTable:
  private val getSql = """SELECT operation,fingerprint,response FROM operation_receipts WHERE user_id=? AND request_id=?"""
  def get(connection: Connection, userId: UserId, requestId: String, operation: String, fingerprint: String): IO[Option[String]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,requestId) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { if rows.next() then { require(rows.getString(1)==operation && rows.getString(2)==fingerprint,"请求标识已用于其他操作"); Some(rows.getString(3)) } else None })
    }

  private val saveSql = """INSERT INTO operation_receipts(user_id,request_id,operation,fingerprint,response) VALUES (?,?,?,?,?)"""
  def save(connection: Connection, userId: UserId, requestId: String, operation: String, fingerprint: String, response: String): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(saveSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,requestId);statement.setString(3,operation);statement.setString(4,fingerprint);statement.setString(5,response) } *> IO.blocking(statement.executeUpdate()).void
    }
