package services.wishes.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import services.wishes.api.*
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.system.objects.DomainError
import services.system.routes.Register
object WishesRoutes:
  val apiMessages = List(
    Register.message[PerformWeaponWishMessage,WishResult](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        request <- j.hcursor.get[String]("requestId")
      yield PerformWeaponWishMessage(user,request)),
    Register.message[PerformWishMessage,WishResult](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        request <- j.hcursor.get[String]("requestId")
      yield PerformWishMessage(user,request))
  )
