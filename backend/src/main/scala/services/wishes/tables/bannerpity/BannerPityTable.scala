package services.wishes.tables.bannerpity
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
import services.identity.objects.UserId
import services.wishes.objects.{WishBanner,WishPity}
object BannerPityTable:
  private val getSql = "SELECT four_count,five_count FROM banner_pity WHERE user_id=? AND banner=?"
  def get(connection: Connection, userId: UserId, banner: WishBanner): IO[WishPity] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(getSql))).use(s=>
      IO.blocking { s.setString(1,userId.value);s.setString(2,WishBanner.toString(banner)) } *>
        Resource.fromAutoCloseable(IO.blocking(s.executeQuery())).use(rows=>IO.blocking {
          if rows.next() then WishPity(rows.getInt(1),rows.getInt(2)) else WishPity(0,0)
        })
    )
  private val setSql = "INSERT INTO banner_pity(user_id,banner,four_count,five_count) VALUES (?,?,?,?) ON CONFLICT(user_id,banner) DO UPDATE SET four_count=EXCLUDED.four_count,five_count=EXCLUDED.five_count"
  def set(connection: Connection, userId: UserId, banner: WishBanner, pity: WishPity): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.prepareStatement(setSql))).use(s=>
      IO.blocking { s.setString(1,userId.value);s.setString(2,WishBanner.toString(banner));s.setInt(3,pity.four);s.setInt(4,pity.five) } *> IO.blocking(s.executeUpdate()).void
    )
