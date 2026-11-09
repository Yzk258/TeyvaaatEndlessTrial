package services.system.tables.schema
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
object SchemaVersionTable:
  private val lockSql = """SELECT pg_advisory_xact_lock(741285930)"""
  def lockInitialization(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(lockSql))).use(s=>
      Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(_=>IO.unit)
    )
  private val containsSql = """SELECT 1 FROM schema_versions WHERE version=?"""
  def contains(connection: Connection, version: SchemaVersion): IO[Boolean] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(containsSql))).use(s=>
      IO.blocking(s.setString(1,version.value)) *>
        Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking(rows.next()))
    )
  private val recordSql = """INSERT INTO schema_versions(version) VALUES (?)"""
  def record(connection: Connection, version: SchemaVersion): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(recordSql))).use(s=>
      IO.blocking(s.setString(1,version.value)) *> IO.blocking(s.executeUpdate()).void
    )
  private val countSql = """SELECT count(*) FROM schema_versions"""
  def countApplied(connection: Connection): IO[Int] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(countSql))).use(s=>
      Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking { require(rows.next());rows.getInt(1) })
    )
