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

final case class InitializeAdminMessage() extends NoRequestMessage[Unit]:
  override def plan(connection: Connection): IO[Unit] =
    for
      settings <- IO((sys.env.get("ADMIN_USERNAME").filter(_.nonEmpty),sys.env.get("ADMIN_PASSWORD").filter(_.nonEmpty)))
      _ <- settings match
        case (None,None) => IO.unit
        case (Some(username),Some(password)) =>
          for
            normalized <- validateCredentials(username,password)
            _ <- AccountTable.lockRoles(connection)
            admins <- AccountTable.countAdmins(connection)
            _ <- IO.whenA(admins==0)(
              for
                _ <- AccountTable.lockUsername(connection,normalized)
                exists <- AccountTable.findByUsername(connection,normalized)
                _ <- IO.raiseWhen(exists.nonEmpty)(DomainError("初始化管理员用户名已被占用"))
                digest <- hashPassword(password)
                guest <- CreateGuestMessage("管理员").plan(connection)
                user <- UserTable.resolve(connection,guest.token).flatMap(value=>IO.fromOption(value)(DomainError("创建管理员失败")))
                _ <- AccountTable.create(connection,user,normalized,digest,UserRole.Admin)
                _ <- RoleAuditTable.append(connection,user,user,UserRole.User,UserRole.Admin)
              yield ()
            )
          yield ()
        case _ => IO.raiseError(DomainError("管理员初始化需同时提供ADMIN_USERNAME与ADMIN_PASSWORD"))
    yield ()
