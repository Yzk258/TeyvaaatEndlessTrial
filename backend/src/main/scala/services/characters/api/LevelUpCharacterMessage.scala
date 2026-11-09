package services.characters.api
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

final case class LevelUpCharacterMessage(userId: UserId, characterId: CharacterId, requestId: String) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      existing <- ReceiptTable.get(connection,userId,requestId,"level",characterId.value)
      result <- existing match
        case Some(saved) => IO.fromEither(decode[Profile](saved))
        case None =>
          for
            definitions <- services.content.api.ListCharactersMessage().plan(connection)
            definition <- IO.fromOption(definitions.find(_.id==characterId.value))(DomainError("角色配置不存在"))
            owned <- CharacterTable.list(connection,userId)
            character <- IO.fromOption(owned.find(_.id==characterId.value))(DomainError("尚未拥有该角色"))
            _ <- IO.raiseWhen(character.level>=definition.maxLevel)(DomainError("已达到初版等级上限"))
            wallet <- WalletTable.get(connection,userId)
            _ <- IO.raiseWhen(wallet.mora<definition.levelUpCost)(DomainError("摩拉不足"))
            _ <- WalletTable.adjust(connection,userId,0,-definition.levelUpCost,0)
            _ <- LedgerTable.append(connection,userId,0,-500,0,"level:"+requestId)
            _ <- CharacterTable.levelUp(connection,userId,characterId)
            profile <- GetProfileMessage(userId).plan(connection)
            _ <- ReceiptTable.save(connection,userId,requestId,"level",characterId.value,profile.asJson.noSpaces)
          yield profile
    yield result
