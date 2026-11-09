package services.system.routes
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.IO
import io.circe.Json
import java.sql.Connection
import services.identity.objects.UserId
final case class RouteRegistration(
  name: String,
  authenticated: Boolean,
  handle: (Json,Option[UserId],Connection) => IO[Json]
)
