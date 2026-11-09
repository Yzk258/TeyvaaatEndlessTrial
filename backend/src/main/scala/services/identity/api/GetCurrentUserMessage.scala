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

final case class GetCurrentUserMessage(userId: UserId) extends APIMessage[CurrentUser]:
  override def plan(connection: Connection): IO[CurrentUser] =
    for
      user <- UserTable.find(connection,userId).flatMap(value=>IO.fromOption(value)(AuthenticationError("用户不存在")))
      account <- AccountTable.findByUserId(connection,userId)
    yield CurrentUser(userId.value,account.map(_.username),user.nickname,account.fold(UserRole.User)(_.role),account.isEmpty)
