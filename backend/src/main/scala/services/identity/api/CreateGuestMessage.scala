package services.identity.api
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import io.circe.syntax.*
import io.circe.parser.decode
import services.system.api.APIMessage
import services.system.objects.DomainError
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.identity.tables.user.UserTable
import services.characters.tables.character.CharacterTable
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.wishes.tables.pity.PityTable
import services.runs.tables.run.RunTable
import services.system.tables.receipt.ReceiptTable
import services.economy.api.GetProfileMessage

final case class CreateGuestMessage(nickname: String) extends APIMessage[GuestSession]:
  override def plan(connection: Connection): IO[GuestSession] =
    for
      _ <- IO.raiseWhen(nickname.trim.isEmpty || nickname.length>30)(DomainError("昵称需为1至30个字符"))
      id <- IO(java.util.UUID.randomUUID().toString).map(UserId.apply)
      token <- IO(java.util.UUID.randomUUID().toString)
      _ <- UserTable.create(connection,id,token,nickname.trim)
      _ <- WalletTable.create(connection,id)
      _ <- LedgerTable.append(connection,id,1600,5000,10,"initial")
      _ <- CharacterTable.grant(connection,id,CharacterId("amber"))
      _ <- PityTable.create(connection,id)
    yield GuestSession(token)
