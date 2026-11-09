package services.characters.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import services.characters.api.*
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.system.objects.DomainError
import services.system.routes.Register
object CharactersRoutes:
  val apiMessages = List(
    Register.message[LevelUpCharacterMessage,Profile](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        id <- j.hcursor.get[String]("characterId")
        request <- j.hcursor.get[String]("requestId")
      yield LevelUpCharacterMessage(user,CharacterId(id),request))
  )
