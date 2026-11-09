package services.wishes.tables.bannerpity
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import java.sql.Connection
object BannerPityTableInitializer:
  private val initializeSql = """CREATE TABLE IF NOT EXISTS banner_pity(user_id TEXT REFERENCES users(id),banner TEXT NOT NULL CHECK(banner IN ('character','weapon')),four_count INT NOT NULL CHECK(four_count BETWEEN 0 AND 9),five_count INT NOT NULL CHECK(five_count>=0 AND five_count<CASE WHEN banner='character' THEN 90 ELSE 80 END),PRIMARY KEY(user_id,banner))"""
  def initialize(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.execute(initializeSql)).void)
  private val migrateSql = """INSERT INTO banner_pity(user_id,banner,four_count,five_count) SELECT user_id,'character',count,count FROM pity_states UNION ALL SELECT user_id,'weapon',count,count FROM weapon_pity ON CONFLICT(user_id,banner) DO NOTHING"""
  def migrateLegacy(connection: Connection): IO[Unit] =
    Resource.fromAutoCloseable(IO.blocking(connection.createStatement())).use(s=>IO.blocking(s.executeUpdate(migrateSql)).void)
