package services.economy.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import services.economy.api.*
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.system.objects.DomainError
import services.system.routes.Register
object EconomyRoutes:
  val apiMessages = List(
    Register.message[GetProfileMessage,Profile](true)((j,u)=>u.toRight(DomainError("请先创建档案")).map(GetProfileMessage.apply)),
    Register.message[ExchangeFatesMessage,Profile](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        count <- j.hcursor.get[Int]("count")
        request <- j.hcursor.get[String]("requestId")
      yield ExchangeFatesMessage(user,count,request))
  )
