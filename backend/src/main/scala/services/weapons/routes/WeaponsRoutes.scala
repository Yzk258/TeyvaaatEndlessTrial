package services.weapons.routes
import services.weapons.api.{EquipWeaponMessage,LevelUpWeaponMessage}
import services.weapons.objects.WeaponId
import services.characters.objects.CharacterId
import services.economy.objects.apiTypes.Profile
import services.system.objects.DomainError
import services.system.routes.Register
object WeaponsRoutes:
  val apiMessages = List(
    Register.message[LevelUpWeaponMessage,Profile](true)((j,u)=>for
      user <- u.toRight(DomainError("请先创建档案"))
      id <- j.hcursor.get[String]("weaponId")
      request <- j.hcursor.get[String]("requestId")
    yield LevelUpWeaponMessage(user,WeaponId(id),request)),
    Register.message[EquipWeaponMessage,Profile](true)((j,u)=>for
      user <- u.toRight(DomainError("请先创建档案"))
      character <- j.hcursor.get[String]("characterId")
      weapon <- j.hcursor.get[Option[String]]("weaponId")
    yield EquipWeaponMessage(user,CharacterId(character),weapon.map(WeaponId.apply)))
  )
