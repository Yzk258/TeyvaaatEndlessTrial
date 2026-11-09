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

final case class EquipWeaponMessage(userId: UserId, characterId: CharacterId, weaponId: Option[WeaponId]) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      characters <- CharacterTable.list(connection,userId)
      _ <- IO.raiseUnless(characters.exists(_.id==characterId.value))(DomainError("尚未拥有该角色"))
      characterDefinitions <- ListCharactersMessage().plan(connection)
      character <- IO.fromOption(characterDefinitions.find(_.id==characterId.value))(DomainError("角色配置不存在"))
      _ <- weaponId match
        case None => EquipmentTable.unequip(connection,userId,characterId)
        case Some(id) =>
          for
            definitions <- ListWeaponsMessage().plan(connection)
            definition <- IO.fromOption(definitions.find(_.id==id.value))(DomainError("武器配置不存在"))
            owned <- WeaponTable.list(connection,userId)
            _ <- IO.raiseUnless(owned.exists(_.id==id.value))(DomainError("尚未拥有该武器"))
            _ <- IO.raiseWhen(definition.weapon!=character.weapon)(DomainError("武器类型与角色不匹配"))
            equipment <- EquipmentTable.list(connection,userId)
            _ <- IO.raiseWhen(equipment.exists(e=>e.weaponId==id.value && e.characterId!=characterId.value))(DomainError("武器已被其他角色装备，请先卸下"))
            _ <- EquipmentTable.equip(connection,userId,characterId,id)
          yield ()
      profile <- GetProfileMessage(userId).plan(connection)
    yield profile
