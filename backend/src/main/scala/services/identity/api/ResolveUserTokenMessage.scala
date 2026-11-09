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

final case class ResolveUserTokenMessage(token: String) extends APIMessage[Option[UserId]]:
  override def plan(connection: Connection): IO[Option[UserId]] =
    if token.isEmpty || token.length>512 then IO.pure(None)
    else for
      now <- IO.realTimeInstant
      digest <- sessionDigest(token)
      session <- SessionTable.resolve(connection,digest,now)
      result <- session.fold(UserTable.resolve(connection,token))(id=>IO.pure(Some(id)))
    yield result
