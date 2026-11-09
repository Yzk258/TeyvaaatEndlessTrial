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
import services.characters.tables.character.CharacterTable
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.wishes.tables.bannerpity.BannerPityTable
import services.wishes.objects.WishBanner
import services.runs.tables.run.RunTable
import services.system.tables.receipt.ReceiptTable
import services.economy.api.GetProfileMessage

final case class GetProfileMessage(userId: UserId) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      wallet <- WalletTable.get(connection,userId)
      characters <- CharacterTable.list(connection,userId)
      pity <- BannerPityTable.get(connection,userId,WishBanner.Character)
      runs <- RunTable.countSettled(connection,userId)
      weapons <- services.weapons.tables.weapon.WeaponTable.list(connection,userId)
      equipment <- services.weapons.tables.equipment.EquipmentTable.list(connection,userId)
      weaponPity <- BannerPityTable.get(connection,userId,WishBanner.Weapon)
    yield Profile(wallet.primogems,wallet.mora,wallet.intertwinedFates,characters,pity.five,runs,weapons,equipment,weaponPity.five,pity.four,weaponPity.four)
