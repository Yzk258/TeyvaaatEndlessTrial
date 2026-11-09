package services.system.utils
import cats.effect.{IO,Resource}
import cats.syntax.all.*
import com.zaxxer.hikari.{HikariConfig,HikariDataSource}
import java.sql.Connection
private[system] def databasePool: Resource[IO,HikariDataSource] =
  Resource.fromAutoCloseable(IO.blocking {
    val config=new HikariConfig()
    config.setJdbcUrl(sys.env.getOrElse("DB_URL","jdbc:postgresql://127.0.0.1:5433/teyvat"))
    config.setUsername(sys.env.getOrElse("DB_USER","db"))
    config.setPassword(sys.env.getOrElse("DB_PASSWORD","root"))
    config.setMaximumPoolSize(sys.env.getOrElse("DB_POOL_SIZE","6").toInt)
    config.setMinimumIdle(1)
    config.setConnectionTimeout(sys.env.getOrElse("DB_CONNECTION_TIMEOUT_MS","5000").toLong)
    config.setPoolName("teyvat-database")
    config.setAutoCommit(false)
    new HikariDataSource(config)
  })
private[system] def transaction[A](pool: HikariDataSource)(operation: Connection => IO[A]): IO[A] =
  Resource.fromAutoCloseable(IO.blocking(pool.getConnection())).use(connection =>
    IO.uncancelable { poll =>
      val rollback=IO.blocking(connection.rollback()).attempt.void
      IO.blocking(connection.setAutoCommit(false)) *>
        poll(operation(connection)).onCancel(rollback).attempt.flatMap {
          case Right(result) => IO.blocking(connection.commit()).onError { case _ => rollback }.as(result)
          case Left(error) => rollback *> IO.raiseError(error)
        }
      }
  )
