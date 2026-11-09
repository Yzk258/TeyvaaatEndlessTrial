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

final case class ListUsersMessage(userId: UserId) extends APIMessage[List[AccountSummary]]:
  override def plan(connection: Connection): IO[List[AccountSummary]] =
    RequireAdminMessage(userId).plan(connection) *> AccountTable.list(connection)
