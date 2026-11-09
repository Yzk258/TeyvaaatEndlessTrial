package services.runs.api
import cats.effect.IO
import java.sql.Connection
import services.system.api.APIMessage
import services.system.objects.DomainError
import services.identity.objects.UserId
import services.identity.tables.user.UserTable
import services.runs.objects.{RunId,RunStatus}
import services.runs.tables.run.RunTable
import services.economy.objects.apiTypes.Profile
import services.economy.api.GetProfileMessage
final case class AbandonRunMessage(userId: UserId, runId: RunId, kills: Int = 0, ticks: Int = 0) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      run <- RunTable.get(connection,userId,runId).flatMap(r=>IO.fromOption(r)(DomainError("找不到本人的对局")))
      stage <- services.runs.tables.challenge.ChallengeTable.get(connection,runId)
      profile <- if stage.isEmpty then SubmitRunResultMessage(userId,runId,kills,ticks).plan(connection) else
        (run.status match
          case RunStatus.Active => RunTable.abandon(connection,userId,runId)
          case RunStatus.Abandoned => IO.unit
          case RunStatus.Settled => IO.raiseError(DomainError("已结算的对局不能放弃"))
        ).flatMap(_ => GetProfileMessage(userId).plan(connection))
    yield profile
