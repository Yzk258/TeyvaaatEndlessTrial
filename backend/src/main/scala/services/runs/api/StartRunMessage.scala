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

final case class StartRunMessage(userId: UserId, characterId: CharacterId, requestId: String, stageId: Option[String] = None, adventure: Option[AdventureSettings] = None) extends APIMessage[RunStart]:
  private val settings = adventure.getOrElse(AdventureSettings(AdventureMode.Timed,Some(300)))
  private val fingerprint = characterId.value + stageId.fold(":adventure:"+settings.asJson.noSpaces)(id => ":stage:"+id)
  override def plan(connection: Connection): IO[RunStart] =
    for
      _ <- UserTable.lock(connection,userId)
      _ <- IO.raiseWhen(stageId.nonEmpty && adventure.nonEmpty || stageId.isEmpty && !services.runs.utils.validAdventureSettings(settings))(DomainError("请选择有效的冒险模式；限时为 60～3600 秒，无尽模式不设置时长"))
      existing <- ReceiptTable.get(connection,userId,requestId,"start",fingerprint)
      result <- existing match
        case Some(saved) => IO.fromEither(decode[RunStart](saved))
        case None =>
          for
            stages <- ListStagesMessage().plan(connection)
            stage <- stageId.traverse(id => IO.fromOption(stages.find(_.id==id))(DomainError("关卡不存在")))
            definitions <- services.content.api.ListCharactersMessage().plan(connection)
            definition <- IO.fromOption(definitions.find(_.id==characterId.value))(DomainError("角色配置不存在"))
            owned <- CharacterTable.list(connection,userId)
            character <- IO.fromOption(owned.find(_.id==characterId.value))(DomainError("不能使用未拥有的角色"))
            id <- IO(java.util.UUID.randomUUID().toString).map(RunId.apply)
            seed <- IO(new java.security.SecureRandom().nextInt(Int.MaxValue).toLong)
            _ <- RunTable.create(connection,userId,id,characterId,seed,character.level)
            _ <- stage.traverse_(definition => services.runs.tables.challenge.ChallengeTable.create(connection,id,definition))
            plan <- if stage.nonEmpty then IO.pure(Option.empty[AdventurePlan]) else ListAdventureRulesMessage().plan(connection).map(rules => Some(AdventurePlan(settings,rules)))
            _ <- plan.traverse_(value => services.runs.tables.adventure.AdventureTable.create(connection,id,value))
            equippedWeapon <- services.weapons.api.GetEquippedWeaponMessage(userId,characterId).plan(connection)
            result = RunStart(id.value,seed,character.level,stage,definition,equippedWeapon,plan)
            _ <- ReceiptTable.save(connection,userId,requestId,"start",fingerprint,result.asJson.noSpaces)
          yield result
    yield result
