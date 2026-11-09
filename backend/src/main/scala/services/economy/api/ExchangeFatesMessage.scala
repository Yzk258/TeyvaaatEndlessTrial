package services.economy.api
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
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.system.tables.receipt.ReceiptTable
import services.content.api.ListWishRulesMessage

final case class ExchangeFatesMessage(userId: UserId, count: Int, requestId: String) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      existing <- ReceiptTable.get(connection,userId,requestId,"exchange-fates","v1")
      result <- existing match
        case Some(saved) => IO.fromEither(decode[Profile](saved))
        case None =>
          for
            _ <- IO.raiseWhen(count<=0 || count>999)(DomainError("兑换数量需为1至999"))
            rules <- ListWishRulesMessage().plan(connection)
            wallet <- WalletTable.get(connection,userId)
            cost = rules.cost * count
            _ <- IO.raiseWhen(wallet.primogems<cost)(DomainError(s"原石不足，需要${cost}原石"))
            _ <- WalletTable.adjust(connection,userId,-cost,0,count)
            _ <- LedgerTable.append(connection,userId,-cost,0,count,"exchange-fates:"+requestId)
            profile <- GetProfileMessage(userId).plan(connection)
            _ <- ReceiptTable.save(connection,userId,requestId,"exchange-fates","v1",profile.asJson.noSpaces)
          yield profile
    yield result
