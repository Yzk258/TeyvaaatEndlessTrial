package services.runs.api
import cats.effect.IO
import java.sql.Connection
import services.system.api.NoRequestMessage
import services.runs.objects.StageDefinition
final case class ListStagesMessage() extends NoRequestMessage[List[StageDefinition]]:
  override def plan(connection: Connection): IO[List[StageDefinition]] =
    IO.pure(List(
      StageDefinition("forest","低语森林 · 初探",15,300,40),
      StageDefinition("valley","风起山谷 · 清剿",30,600,80),
      StageDefinition("ruins","遗迹边境 · 突围",50,1000,120)
    ))
