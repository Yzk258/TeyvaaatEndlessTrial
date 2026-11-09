package services.system.utils
import cats.effect.{IO,IOApp}
import cats.syntax.all.*
import io.circe.syntax.*
import services.system.api.InitializeDatabaseMessage
import services.identity.api.CreateGuestMessage
import services.identity.tables.user.UserTable
import services.economy.api.GetProfileMessage
import services.economy.tables.wallet.WalletTable
import services.content.api.ListWeaponsMessage
import services.content.objects.{Rarity,WeaponType}
import services.wishes.api.{PerformWishMessage,PerformWeaponWishMessage}
import services.wishes.objects.{WishBanner,WishPity,WishReward}
import services.wishes.tables.bannerpity.{BannerPityTable,BannerPityTableInitializer}
import services.wishes.tables.pity.PityTable
import services.wishes.tables.weaponpity.WeaponPityTable
import services.weapons.api.{LevelUpWeaponMessage,EquipWeaponMessage}
import services.weapons.tables.weapon.WeaponTable
import services.weapons.objects.WeaponId
import services.characters.objects.CharacterId
import services.runs.api.{StartRunMessage,AbandonRunMessage}
import services.runs.objects.RunId
object WishTransactionCheck extends IOApp.Simple:
  def run: IO[Unit] = databasePool.use(pool=>for
    _ <- transaction(pool)(InitializeDatabaseMessage().plan)
    session <- transaction(pool)(CreateGuestMessage("稀有度事务验收").plan)
    user <- transaction(pool)(c=>UserTable.resolve(c,session.token).flatMap(u=>IO.fromOption(u)(new RuntimeException("测试账号缺失"))))
    _ <- transaction(pool)(c=>PityTable.set(c,user,3) *> WeaponPityTable.set(c,user,2) *> BannerPityTableInitializer.migrateLegacy(c))
    migrated <- transaction(pool)(c=>(BannerPityTable.get(c,user,WishBanner.Character),BannerPityTable.get(c,user,WishBanner.Weapon)).tupled)
    _ <- IO(assert(migrated==(WishPity(3,3),WishPity(2,2))))
    _ <- transaction(pool)(c=>BannerPityTable.set(c,user,WishBanner.Character,WishPity(9,89)))
    character <- transaction(pool)(c=>PerformWishMessage(user,"character-hard-pity").plan(c))
    _ <- IO {
      assert(character.reward match {case WishReward.Character(_,Rarity.Five)=>true;case _=>false})
      assert(character.profile.pity==0 && character.profile.fourStarPity==9)
      assert(character.profile.weaponPity==2 && character.profile.weaponFourStarPity==2)
    }
    four <- transaction(pool)(c=>PerformWishMessage(user,"character-four-pity").plan(c))
    _ <- IO(assert(four.reward match {
      case WishReward.Character(_,Rarity.Three) | WishReward.Weapon(_,Rarity.Three)=>false
      case _=>true
    }))
    _ <- transaction(pool)(c=>BannerPityTable.set(c,user,WishBanner.Weapon,WishPity(9,79)))
    pair <- List.fill(2)(transaction(pool)(c=>PerformWeaponWishMessage(user,"weapon-hard-pity").plan(c))).parSequence
    _ <- IO {
      assert(pair.head==pair.last)
      assert(pair.head.reward match {case WishReward.Weapon(_,Rarity.Five)=>true;case _=>false})
      assert(pair.head.profile.primogems==1600 && pair.head.profile.intertwinedFates==7)
      assert(pair.head.profile.pity==four.profile.pity && pair.head.profile.fourStarPity==four.profile.fourStarPity)
      assert(pair.head.profile.weaponPity==0 && pair.head.profile.weaponFourStarPity==9)
    }
    beforeMigration <- transaction(pool)(GetProfileMessage(user).plan)
    _ <- transaction(pool)(BannerPityTableInitializer.migrateLegacy)
    afterMigration <- transaction(pool)(GetProfileMessage(user).plan)
    _ <- IO(assert(beforeMigration==afterMigration))
    catalog <- transaction(pool)(ListWeaponsMessage().plan)
    _ <- transaction(pool)(c=>UserTable.lock(c,user) *> catalog.traverse_(w=>WeaponTable.grant(c,user,WeaponId(w.id))))
    beforeCultivation <- transaction(pool)(GetProfileMessage(user).plan)
    _ <- catalog.traverse_(w=>transaction(pool)(c=>LevelUpWeaponMessage(user,WeaponId(w.id),"level-"+w.id).plan(c)))
    afterCultivation <- transaction(pool)(GetProfileMessage(user).plan)
    _ <- IO {
      assert(afterCultivation.weapons.size==15 && afterCultivation.weapons.forall(_.level==2))
      assert(afterCultivation.mora==beforeCultivation.mora-catalog.map(_.levelUpCost).sum)
    }
    _ <- catalog.filter(_.weapon==WeaponType.Bow).traverse_(w=>for
      _ <- transaction(pool)(c=>EquipWeaponMessage(user,CharacterId("amber"),Some(WeaponId(w.id))).plan(c))
      run <- transaction(pool)(c=>StartRunMessage(user,CharacterId("amber"),"start-"+w.id,None).plan(c))
      _ <- IO(assert(run.equippedWeapon.exists(loadout=>loadout.definition==w && loadout.level==2)))
      _ <- transaction(pool)(c=>AbandonRunMessage(user,RunId(run.runId)).plan(c))
    yield ())
    _ <- transaction(pool)(c=>WalletTable.adjust(c,user,0,0,-7))
    beforeFailure <- transaction(pool)(GetProfileMessage(user).plan)
    failed <- transaction(pool)(c=>PerformWeaponWishMessage(user,"insufficient").plan(c)).attempt
    afterFailure <- transaction(pool)(GetProfileMessage(user).plan)
    _ <- IO(assert(failed.isLeft && beforeFailure==afterFailure))
    _ <- IO.println("PASS: 旧保底迁移不重置、五星保证、四星保障、并发幂等只扣一次、两池隔离、15件武器培养与装备快照、余额不足整体回滚")
  yield ())
