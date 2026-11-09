package services.system.utils
import cats.effect.{IO,IOApp}
import cats.syntax.all.*
import scala.concurrent.duration.*
import services.system.api.InitializeDatabaseMessage
import services.identity.api.CreateGuestMessage
import services.identity.tables.user.UserTable
import services.economy.tables.wallet.WalletTable
object DatabaseTransactionCheck extends IOApp.Simple:
  def run: IO[Unit] =
    databasePool.use(pool =>
      for
        _ <- transaction(pool)(InitializeDatabaseMessage().plan)
        session <- transaction(pool)(CreateGuestMessage("数据库事务验收").plan)
        user <- transaction(pool)(c=>UserTable.resolve(c,session.token).flatMap(value=>IO.fromOption(value)(new RuntimeException("测试身份缺失"))))
        original <- transaction(pool)(c=>WalletTable.get(c,user))
        failed <- transaction(pool)(c=>WalletTable.adjust(c,user,-100,-100,0) *> IO.raiseError[Unit](new RuntimeException("intentional rollback"))).attempt
        afterFailure <- transaction(pool)(c=>WalletTable.get(c,user))
        _ <- IO.raiseUnless(failed.isLeft && afterFailure==original)(new RuntimeException("异常回滚失败"))
        cancelled <- transaction(pool)(c=>WalletTable.adjust(c,user,-100,-100,0) *> IO.never[Unit]).timeout(150.millis).attempt
        afterCancel <- transaction(pool)(c=>WalletTable.get(c,user))
        _ <- IO.raiseUnless(cancelled.isLeft && afterCancel==original)(new RuntimeException("取消回滚失败"))
        _ <- IO.println("PASS: 写入后异常回滚、取消后回滚、连接可再次使用、余额保持原值")
      yield ()
    )
