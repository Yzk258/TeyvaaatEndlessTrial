package services.runs.tables.run
import services.economy.objects.apiTypes.*
import services.wishes.objects.apiTypes.*
import services.runs.objects.apiTypes.*
import services.identity.objects.apiTypes.*
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.characters.objects.{CharacterId,OwnedCharacter}
import services.economy.objects.Wallet
import services.runs.objects.{RunId,RunRecord,RunStatus}
object RunTable:
  private val createSql = """INSERT INTO runs(id,user_id,character_id,seed,level,status) VALUES (?,?,?,?,?,'active')"""
  def create(connection: Connection, userId: UserId, runId: RunId, characterId: CharacterId, seed: Long, level: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(createSql))).use { statement =>
      IO.blocking { statement.setString(1,runId.value);statement.setString(2,userId.value);statement.setString(3,characterId.value);statement.setLong(4,seed);statement.setInt(5,level) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val getSql = """SELECT id,character_id,seed,level,status,ticks,kills,EXTRACT(EPOCH FROM (now()-created_at))::bigint FROM runs WHERE user_id=? AND id=?"""
  def get(connection: Connection, userId: UserId, runId: RunId): IO[Option[RunRecord]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,runId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { if rows.next() then Some(RunRecord(rows.getString(1),rows.getString(2),rows.getLong(3),rows.getInt(4),RunStatus.fromString(rows.getString(5)).fold(message => throw new IllegalArgumentException(message),identity),rows.getInt(6),rows.getInt(7),rows.getLong(8))) else None })
    }

  private val settleSql = """UPDATE runs SET status='settled',ticks=?,kills=? WHERE user_id=? AND id=?"""
  def settle(connection: Connection, userId: UserId, runId: RunId, ticks: Int, kills: Int): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(settleSql))).use { statement =>
      IO.blocking { statement.setInt(1,ticks);statement.setInt(2,kills);statement.setString(3,userId.value);statement.setString(4,runId.value) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val countSettledSql = """SELECT count(*) FROM runs WHERE user_id=? AND status='settled'"""
  def countSettled(connection: Connection, userId: UserId): IO[Int] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(countSettledSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use(rows => IO.blocking { require(rows.next());rows.getInt(1) })
    }

  private val abandonSql = """UPDATE runs SET status='abandoned' WHERE user_id=? AND id=? AND status='active'"""
  def abandon(connection: Connection, userId: UserId, runId: RunId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(abandonSql))).use(s =>
      IO.blocking { s.setString(1,userId.value);s.setString(2,runId.value) } *> IO.blocking(s.executeUpdate()).void
    )
