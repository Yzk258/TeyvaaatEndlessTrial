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

final case class RegisterMessage(username: String, password: String, nickname: String) extends APIMessage[AuthSession]:
  override def plan(connection: Connection): IO[AuthSession] =
    for
      normalized <- validateCredentials(username,password)
      _ <- AccountTable.lockUsername(connection,normalized)
      exists <- AccountTable.findByUsername(connection,normalized)
      _ <- IO.raiseWhen(exists.nonEmpty)(DomainError("用户名已被使用"))
      digest <- hashPassword(password)
      guest <- CreateGuestMessage(if nickname.trim.isEmpty then normalized else nickname).plan(connection)
      userId <- UserTable.resolve(connection,guest.token).flatMap(value=>IO.fromOption(value)(DomainError("创建用户失败")))
      _ <- AccountTable.create(connection,userId,normalized,digest,UserRole.User)
      session <- OpenSessionMessage(userId).plan(connection)
    yield session
