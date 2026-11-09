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

final case class BindAccountMessage(userId: UserId, username: String, password: String, nickname: String) extends APIMessage[AuthSession]:
  override def plan(connection: Connection): IO[AuthSession] =
    for
      normalized <- validateCredentials(username,password)
      _ <- AccountTable.lockUsername(connection,normalized)
      _ <- UserTable.lock(connection,userId)
      current <- AccountTable.findByUserId(connection,userId)
      _ <- IO.raiseWhen(current.nonEmpty)(DomainError("当前档案已绑定账号"))
      existing <- AccountTable.findByUsername(connection,normalized)
      _ <- IO.raiseWhen(existing.nonEmpty)(DomainError("用户名已被使用"))
      _ <- IO.raiseWhen(nickname.trim.isEmpty || nickname.length>30)(DomainError("昵称需为1至30个字符"))
      digest <- hashPassword(password)
      _ <- AccountTable.create(connection,userId,normalized,digest,UserRole.User)
      _ <- UserTable.rename(connection,userId,nickname.trim)
      session <- OpenSessionMessage(userId).plan(connection)
    yield session
