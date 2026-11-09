package services.runs.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import services.runs.api.*
import services.identity.objects.*
import services.characters.objects.*
import services.economy.objects.*
import services.wishes.objects.*
import services.runs.objects.*
import services.system.objects.DomainError
import services.system.routes.Register
object RunsRoutes:
  val apiMessages = List(
    Register.message[AbandonRunMessage,Profile](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        id <- j.hcursor.get[String]("runId")
        kills <- j.hcursor.get[Option[Int]]("kills")
        ticks <- j.hcursor.get[Option[Int]]("ticks")
      yield AbandonRunMessage(user,RunId(id),kills.getOrElse(0),ticks.getOrElse(0))),
    Register.message[ListStagesMessage,List[StageDefinition]](false)((j,u)=>Right(ListStagesMessage())),
    Register.message[StartRunMessage,RunStart](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        id <- j.hcursor.get[String]("characterId")
        request <- j.hcursor.get[String]("requestId")
        stage <- j.hcursor.get[Option[String]]("stageId")
        adventure <- j.hcursor.get[Option[AdventureSettings]]("adventure")
      yield StartRunMessage(user,CharacterId(id),request,stage,adventure)),
    Register.message[SubmitRunResultMessage,Profile](true)((j,u)=>for
        user <- u.toRight(DomainError("请先创建档案"))
        id <- j.hcursor.get[String]("runId")
        kills <- j.hcursor.get[Int]("kills")
        ticks <- j.hcursor.get[Int]("ticks")
      yield SubmitRunResultMessage(user,RunId(id),kills,ticks))
  )
