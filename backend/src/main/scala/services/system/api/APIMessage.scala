package services.system.api
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.IO
import java.sql.Connection
trait APIMessage[A]:
  def plan(connection: Connection): IO[A]
trait NoRequestMessage[A] extends APIMessage[A]
