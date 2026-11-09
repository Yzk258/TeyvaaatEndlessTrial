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

final case class GetEquippedWeaponMessage(userId: UserId, characterId: CharacterId) extends APIMessage[Option[WeaponLoadout]]:
  override def plan(connection: Connection): IO[Option[WeaponLoadout]] =
    for
      equipment <- EquipmentTable.list(connection,userId)
      loadout <- equipment.find(_.characterId==characterId.value).traverse { equipped =>
        for
          owned <- WeaponTable.list(connection,userId)
          weapon <- IO.fromOption(owned.find(_.id==equipped.weaponId))(DomainError("武器记录缺失"))
          definitions <- ListWeaponsMessage().plan(connection)
          definition <- IO.fromOption(definitions.find(_.id==weapon.id))(DomainError("武器配置缺失"))
          characters <- ListCharactersMessage().plan(connection)
          character <- IO.fromOption(characters.find(_.id==characterId.value))(DomainError("角色配置缺失"))
          _ <- IO.raiseWhen(character.weapon!=definition.weapon)(DomainError("装备类型与角色当前配置不匹配，请卸下"))
        yield WeaponLoadout(definition,weapon.level)
      }
    yield loadout
