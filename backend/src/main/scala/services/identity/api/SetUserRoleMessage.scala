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

final case class SetUserRoleMessage(userId: UserId, targetId: UserId, role: UserRole) extends APIMessage[List[AccountSummary]]:
  override def plan(connection: Connection): IO[List[AccountSummary]] =
    for
      _ <- AccountTable.lockRoles(connection)
      _ <- RequireAdminMessage(userId).plan(connection)
      target <- AccountTable.findByUserId(connection,targetId).flatMap(value=>IO.fromOption(value)(DomainError("目标账号不存在")))
      _ <- IO.raiseWhen(userId==targetId && target.role!=role)(DomainError("不能修改自己的管理员身份"))
      admins <- AccountTable.countAdmins(connection)
      _ <- IO.raiseWhen(target.role==UserRole.Admin && role==UserRole.User && admins<=1)(DomainError("必须保留至少一名管理员"))
      _ <- IO.unlessA(target.role==role)(
        AccountTable.setRole(connection,targetId,role) *>
          RoleAuditTable.append(connection,userId,targetId,target.role,role)
      )
      users <- AccountTable.list(connection)
    yield users
