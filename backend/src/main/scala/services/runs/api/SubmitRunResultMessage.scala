package services.runs.api
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import io.circe.syntax.*
import io.circe.parser.decode
import services.system.api.APIMessage
import services.system.objects.DomainError
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.identity.tables.user.UserTable
import services.characters.tables.character.CharacterTable
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.wishes.tables.pity.PityTable
import services.runs.tables.run.RunTable
import services.system.tables.receipt.ReceiptTable
import services.economy.api.GetProfileMessage

final case class SubmitRunResultMessage(userId: UserId, runId: RunId, kills: Int, ticks: Int) extends APIMessage[Profile]:
  override def plan(connection: Connection): IO[Profile] =
    for
      _ <- UserTable.lock(connection,userId)
      run <- RunTable.get(connection,userId,runId).flatMap(r=>IO.fromOption(r)(DomainError("找不到本人的对局")))
      stage <- services.runs.tables.challenge.ChallengeTable.get(connection,runId)
      savedPlan <- services.runs.tables.adventure.AdventureTable.get(connection,runId)
      rules <- ListAdventureRulesMessage().plan(connection)
      plan = savedPlan.getOrElse(AdventurePlan(AdventureSettings(AdventureMode.Endless,None),rules))
      _ <- IO.raiseWhen(ticks<0 || stage.nonEmpty && ticks<1 || kills<0)(DomainError("战果数据不合理"))
      _ <- IO.raiseWhen(run.elapsed+3 < ticks/20)(DomainError("对局时长不合理"))
      maximumKills = if stage.nonEmpty then ticks.toLong/12 else services.runs.utils.maximumAdventureKills(plan,ticks)
      _ <- IO.raiseWhen(kills.toLong>maximumKills)(DomainError("击杀超过本局可生成的敌人数"))
      _ <- IO.raiseWhen(stage.isEmpty && plan.settings.durationSeconds.exists(seconds => ticks>seconds*20))(DomainError("超过所选冒险时长"))
      _ <- IO.raiseWhen(stage.exists(s => kills>s.enemies))(DomainError("击杀超过本关敌人总数"))
      cleared = stage.exists(s => kills==s.enemies)
      reward = stage.fold(services.runs.utils.adventureReward(plan,kills,ticks))(s => RunReward(if cleared then s.mora else 0,if cleared then s.primogems else 0))
      gems = reward.primogems
      mora = reward.mora
      _ <- run.status match
        case RunStatus.Abandoned => IO.raiseError(DomainError("已放弃的对局不能领取奖励"))
        case RunStatus.Settled => IO.raiseWhen(run.ticks!=ticks || run.kills!=kills)(DomainError("该对局已使用不同结果结算"))
        case RunStatus.Active =>
          WalletTable.adjust(connection,userId,gems,mora,0) *>
            LedgerTable.append(connection,userId,gems,mora,0,"run:"+runId.value) *>
            RunTable.settle(connection,userId,runId,ticks,kills)
      profile <- GetProfileMessage(userId).plan(connection)
    yield profile
