package services.identity.routes
import services.identity.api.*
import services.identity.objects.*
import services.identity.objects.apiTypes.*
import services.system.objects.AuthenticationError
import services.system.routes.Register
object IdentityRoutes:
  val apiMessages = List(
    Register.message[CreateGuestMessage,GuestSession](false)((j,u)=>j.hcursor.get[String]("nickname").map(CreateGuestMessage.apply)),
    Register.message[RegisterMessage,AuthSession](false)((j,u)=>for
      username <- j.hcursor.get[String]("username")
      password <- j.hcursor.get[String]("password")
      nickname <- j.hcursor.get[String]("nickname")
    yield RegisterMessage(username,password,nickname)),
    Register.message[LoginMessage,LoginResponse](false)((j,u)=>for
      username <- j.hcursor.get[String]("username")
      password <- j.hcursor.get[String]("password")
    yield LoginMessage(username,password)),
    Register.message[BindAccountMessage,AuthSession](true)((j,u)=>for
      user <- u.toRight(AuthenticationError("请先登录"))
      username <- j.hcursor.get[String]("username")
      password <- j.hcursor.get[String]("password")
      nickname <- j.hcursor.get[String]("nickname")
    yield BindAccountMessage(user,username,password,nickname)),
    Register.message[GetCurrentUserMessage,CurrentUser](true)((j,u)=>u.toRight(AuthenticationError("请先登录")).map(GetCurrentUserMessage.apply)),
    Register.message[LogoutMessage,Unit](true)((j,u)=>u.toRight(AuthenticationError("请先登录")).map(LogoutMessage.apply)),
    Register.message[ListUsersMessage,List[AccountSummary]](true)((j,u)=>u.toRight(AuthenticationError("请先登录")).map(ListUsersMessage.apply)),
    Register.message[SetUserRoleMessage,List[AccountSummary]](true)((j,u)=>for
      user <- u.toRight(AuthenticationError("请先登录"))
      target <- j.hcursor.get[String]("targetId")
      role <- j.hcursor.get[UserRole]("role")
    yield SetUserRoleMessage(user,UserId(target),role))
  )

