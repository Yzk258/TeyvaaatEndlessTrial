package services.content.routes
import services.content.api.{ListCharactersMessage,ListWeaponsMessage}
import services.content.objects.{CharacterDefinition,WeaponDefinition}
import services.system.routes.Register
object ContentRoutes:
  val apiMessages = List(Register.message[ListWeaponsMessage,List[WeaponDefinition]](false)((j,u)=>Right(ListWeaponsMessage())), Register.message[ListCharactersMessage,List[CharacterDefinition]](false)((j,u)=>Right(ListCharactersMessage())))
