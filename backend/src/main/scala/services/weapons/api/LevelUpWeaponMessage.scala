package services.weapons.api
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import io.circe.syntax.*
import io.circe.parser.decode
import services.system.api.APIMessage
import services.system.objects.DomainError
import services.identity.objects.UserId
import services.identity.tables.user.UserTable
import services.characters.objects.CharacterId
import services.characters.tables.character.CharacterTable
import services.weapons.objects.{WeaponId,WeaponLoadout}
import services.weapons.tables.weapon.WeaponTable
import services.weapons.tables.equipment.EquipmentTable
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.economy.objects.apiTypes.Profile
import services.economy.api.GetProfileMessage
import services.system.tables.receipt.ReceiptTable
import services.content.api.{ListWeaponsMessage,ListCharactersMessage}

final case class LevelUpWeaponMessage(userId: UserId, weaponId: WeaponId, requestId: String) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      existing <- ReceiptTable.get(connection,userId,requestId,"weapon-level",weaponId.value)
      result <- existing match
        case Some(saved) => IO.fromEither(decode[Profile](saved))
        case None =>
          for
            definitions <- ListWeaponsMessage().plan(connection)
            definition <- IO.fromOption(definitions.find(_.id==weaponId.value))(DomainError("武器配置不存在"))
            owned <- WeaponTable.list(connection,userId)
            weapon <- IO.fromOption(owned.find(_.id==weaponId.value))(DomainError("尚未拥有该武器"))
            _ <- IO.raiseWhen(weapon.level>=definition.maxLevel)(DomainError("武器已满级"))
            wallet <- WalletTable.get(connection,userId)
            _ <- IO.raiseWhen(wallet.mora<definition.levelUpCost)(DomainError("摩拉不足"))
            _ <- WalletTable.adjust(connection,userId,0,-definition.levelUpCost,0)
            _ <- LedgerTable.append(connection,userId,0,-definition.levelUpCost,0,"weapon-level:"+requestId)
            _ <- WeaponTable.levelUp(connection,userId,weaponId)
            profile <- GetProfileMessage(userId).plan(connection)
            _ <- ReceiptTable.save(connection,userId,requestId,"weapon-level",weaponId.value,profile.asJson.noSpaces)
          yield profile
    yield result
