package services.identity.tables.roleaudit
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.{Connection,Timestamp}
import java.time.Instant
import services.identity.objects.*
import services.identity.objects.apiTypes.AccountSummary
object RoleAuditTable:
  private val appendSql = """INSERT INTO role_audit(actor_id,target_id,old_role,new_role) VALUES (?,?,?,?)"""
  def append(connection: Connection, userId: UserId, targetId: UserId, oldRole: UserRole, newRole: UserRole): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(appendSql))).use(s=>
      IO.blocking { s.setString(1,userId.value);s.setString(2,targetId.value);s.setString(3,UserRole.toString(oldRole));s.setString(4,UserRole.toString(newRole)) } *> IO.blocking(s.executeUpdate()).void
    )
