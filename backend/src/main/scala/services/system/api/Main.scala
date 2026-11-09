package services.system.api
import cats.effect.{IO,IOApp}
import com.zaxxer.hikari.HikariDataSource
import scala.concurrent.duration.*
import services.system.tables.schema.SchemaVersionTable
import cats.syntax.all.*
import org.http4s.*
import org.http4s.dsl.io.*
import org.http4s.circe.*
import org.http4s.ember.server.EmberServerBuilder
import com.comcast.ip4s.*
import io.circe.Json
import services.system.utils.*
import services.identity.tables.user.UserTable
import services.system.objects.{DomainError,AuthenticationError,PermissionError}
import services.identity.routes.IdentityRoutes
import services.economy.routes.EconomyRoutes
import services.characters.routes.CharactersRoutes
import services.wishes.routes.WishesRoutes
import services.runs.routes.RunsRoutes
object Main extends IOApp.Simple:
  private val registrations = services.weapons.routes.WeaponsRoutes.apiMessages ++ services.content.routes.ContentRoutes.apiMessages ++ IdentityRoutes.apiMessages ++ EconomyRoutes.apiMessages ++ CharactersRoutes.apiMessages ++ WishesRoutes.apiMessages ++ RunsRoutes.apiMessages
  private def routes(pool: HikariDataSource) = HttpRoutes.of[IO] {
    case GET -> Root / "api" / "health" =>
      transaction(pool)(SchemaVersionTable.countApplied).timeout(3.seconds).attempt.flatMap {
        case Right(versions) => Ok(Json.obj("status" -> Json.fromString("ok"),"database" -> Json.fromString("ready"),"appliedMigrations" -> Json.fromInt(versions)))
        case Left(_) => ServiceUnavailable(Json.obj("status" -> Json.fromString("unavailable"),"database" -> Json.fromString("unavailable")))
      }
    case request @ POST -> Root / "api" / name =>
      registrations.find(_.name==name) match
        case None => NotFound(Json.obj("error" -> Json.fromString("接口不存在")))
        case Some(registration) =>
          (request.as[Json].flatMap(json => transaction(pool) { connection =>
            val identity = if registration.authenticated then
              IO.fromEither(json.hcursor.get[String]("userToken")).flatMap(token=>services.identity.api.ResolveUserTokenMessage(token).plan(connection)).flatMap(u=>IO.fromOption(u)(AuthenticationError("登录已失效，请重新登录"))).map(Some(_))
            else IO.pure(None)
            identity.flatMap(user=>registration.handle(json,user,connection))
          }).flatMap(Ok(_))).handleErrorWith {
            case error: AuthenticationError => IO.pure(Response[IO](Status.Unauthorized).withEntity(Json.obj("error" -> Json.fromString(error.message))))
            case error: PermissionError => Forbidden(Json.obj("error" -> Json.fromString(error.message)))
            case error: DomainError => BadRequest(Json.obj("error" -> Json.fromString(error.message)))
            case error: IllegalArgumentException => BadRequest(Json.obj("error" -> Json.fromString(error.getMessage)))
            case error: io.circe.Error => BadRequest(Json.obj("error" -> Json.fromString("请求字段无效")))
            case error => IO.println(error.toString) *> InternalServerError(Json.obj("error" -> Json.fromString("服务器暂时无法完成请求")))
          }
  }
  def run: IO[Unit] =
    databasePool.use(pool =>
      transaction(pool)(InitializeDatabaseMessage().plan) *>
      transaction(pool)(services.identity.api.InitializeAdminMessage().plan) *>
        EmberServerBuilder.default[IO].withHost(host"127.0.0.1").withPort(port"8085").withHttpApp(routes(pool).orNotFound).build.use(_ => IO.println("Teyvat API: http://127.0.0.1:8085 · PostgreSQL ready") *> IO.never)
    )
