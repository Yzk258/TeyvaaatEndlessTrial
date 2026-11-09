package services.identity.api
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import services.system.api.{APIMessage,NoRequestMessage}
import services.system.objects.{DomainError,PermissionError,AuthenticationError}
import services.identity.objects.*
import services.identity.objects.apiTypes.*
import services.identity.tables.user.UserTable
import services.identity.tables.account.AccountTable
import services.identity.tables.session.SessionTable
import services.identity.tables.loginattempt.LoginAttemptTable
import services.identity.tables.roleaudit.RoleAuditTable
import services.identity.utils.*

final case class LoginMessage(username: String, password: String) extends APIMessage[LoginResponse]:
  override def plan(connection: Connection): IO[LoginResponse] =
    for
      normalized <- validateCredentials(username,password)
      _ <- AccountTable.lockUsername(connection,normalized)
      now <- IO.realTimeInstant
      previous <- LoginAttemptTable.get(connection,normalized)
      locked = previous.exists(_.blockedUntil.exists(_.isAfter(now)))
      result <- if locked then IO.pure(LoginResponse(LoginStatus.Locked,None,"尝试次数过多，请15分钟后再试"))
        else for
          account <- AccountTable.findByUsername(connection,normalized)
          valid <- verifyPassword(password,account.map(_.passwordHash))
          response <- account.filter(_=>valid) match
            case Some(user) =>
              LoginAttemptTable.clear(connection,normalized) *>
                OpenSessionMessage(user.userId).plan(connection).map(session=>LoginResponse(LoginStatus.Authenticated,Some(session),"登录成功"))
            case None =>
              val failures=previous.filter(attempt=>attempt.lastFailedAt.plusSeconds(900).isAfter(now) && !attempt.blockedUntil.exists(!_.isAfter(now))).fold(1)(_.failures+1)
              val blocked=if failures>=8 then Some(now.plusSeconds(900)) else None
              LoginAttemptTable.save(connection,normalized,LoginAttempt(failures,now,blocked)).as(
                LoginResponse(if blocked.nonEmpty then LoginStatus.Locked else LoginStatus.Invalid,None,if blocked.nonEmpty then "尝试次数过多，请15分钟后再试" else "用户名或密码不正确")
              )
        yield response
    yield result
