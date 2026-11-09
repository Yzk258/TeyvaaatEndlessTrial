package services.characters.tables.character
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
import services.runs.objects.{RunId,RunRecord}
object CharacterTable:
  private val grantSql = """INSERT INTO characters VALUES (?,?,1,0) ON CONFLICT(user_id,id) DO UPDATE SET copies=characters.copies+1"""
  def grant(connection: Connection, userId: UserId, characterId: CharacterId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(grantSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,characterId.value) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val levelUpSql = """UPDATE characters SET level=level+1 WHERE user_id=? AND id=?"""
  def levelUp(connection: Connection, userId: UserId, characterId: CharacterId): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(levelUpSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value);statement.setString(2,characterId.value) } *> IO.blocking(statement.executeUpdate()).void
    }

  private val listSql = """SELECT id,level,copies FROM characters WHERE user_id=? ORDER BY id"""
  def list(connection: Connection, userId: UserId): IO[List[OwnedCharacter]] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(listSql))).use { statement =>
      IO.blocking { statement.setString(1,userId.value) } *> Resource.fromAutoCloseable(IO.blocking(statement.executeQuery())).use { rows =>
        def remaining: IO[List[OwnedCharacter]] = IO.blocking(rows.next()).flatMap {
          case false => IO.pure(Nil)
          case true => IO.blocking(OwnedCharacter(rows.getString(1),rows.getInt(2),rows.getInt(3))).flatMap(item => remaining.map(item :: _))
        }
        remaining
      }
    }
