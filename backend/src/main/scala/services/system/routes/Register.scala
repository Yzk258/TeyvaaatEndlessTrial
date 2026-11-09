package services.system.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.IO
import io.circe.{Json,Encoder}
import io.circe.syntax.*
import scala.reflect.ClassTag
import java.sql.Connection
import services.system.api.APIMessage
import services.identity.objects.UserId
object Register:
  def message[M <: APIMessage[A]: ClassTag,A: Encoder](authenticated: Boolean)(build: (Json,Option[UserId]) => Either[Throwable,M]): RouteRegistration =
    RouteRegistration(
      summon[ClassTag[M]].runtimeClass.getSimpleName.stripSuffix("Message").toLowerCase,
      authenticated,
      (json,user,connection) => IO.fromEither(build(json,user)).flatMap(_.plan(connection)).map(_.asJson)
    )
