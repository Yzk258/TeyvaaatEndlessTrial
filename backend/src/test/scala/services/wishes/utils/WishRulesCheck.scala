package services.wishes.utils
import cats.effect.{IO,IOApp,Resource}
import io.circe.Decoder
import io.circe.parser.decode
import services.content.objects.{Rarity,WishRules,CharacterDefinition,WeaponDefinition}
import services.wishes.objects.{WishBanner,WishPity,WishReward}
object WishRulesCheck extends IOApp.Simple:
  private def load[A: Decoder](name: String): IO[A] =
    Resource.fromAutoCloseable(IO.blocking(scala.io.Source.fromResource(name))).use(s=>IO.blocking(s.mkString).flatMap(json=>IO.fromEither(decode[A](json))))
  def run: IO[Unit] = for
    rules <- load[WishRules]("wish-rules.json")
    characters <- load[List[CharacterDefinition]]("characters.json")
    weapons <- load[List[WeaponDefinition]]("weapons.json")
    _ <- IO {
      val zero = WishPity(0,0)
      assert(drawRarity(rules.character,zero,0.0059)==Rarity.Five)
      assert(drawRarity(rules.character,zero,0.0061)==Rarity.Four)
      assert(drawRarity(rules.character,zero,0.0569)==Rarity.Four)
      assert(drawRarity(rules.character,zero,0.0571)==Rarity.Three)
      assert(drawRarity(rules.weapon,zero,0.0069)==Rarity.Five)
      assert(drawRarity(rules.weapon,zero,0.0071)==Rarity.Four)
      assert(drawRarity(rules.weapon,zero,0.0669)==Rarity.Four)
      assert(drawRarity(rules.weapon,zero,0.0671)==Rarity.Three)
      assert(drawRarity(rules.character,WishPity(0,72),0.02)==Rarity.Four)
      assert(drawRarity(rules.character,WishPity(0,73),0.02)==Rarity.Five)
      assert(drawRarity(rules.weapon,WishPity(0,61),0.02)==Rarity.Four)
      assert(drawRarity(rules.weapon,WishPity(0,62),0.02)==Rarity.Five)
      assert(drawRarity(rules.character,WishPity(9,0),0.999999)==Rarity.Four)
      assert(drawRarity(rules.character,WishPity(9,89),0.999999)==Rarity.Five)
      assert(drawRarity(rules.weapon,WishPity(9,79),0.999999)==Rarity.Five)
      assert(drawRarity(rules.weapon,WishPity(0,76),0.999999)==Rarity.Five)
      assert(drawRarity(rules.character,WishPity(8,0),0.5)==Rarity.Four)
      assert(drawRarity(rules.weapon,WishPity(7,0),0.5)==Rarity.Four)
      assert(nextWishPity(WishPity(9,89),Rarity.Five)==WishPity(9,0))
      assert(nextWishPity(WishPity(9,5),Rarity.Four)==WishPity(0,6))
      assert(nextWishPity(WishPity(2,5),Rarity.Three)==WishPity(3,6))
      val charFive = rewardCandidates(WishBanner.Character,Rarity.Five,0.99,characters,weapons)
      val charFour = rewardCandidates(WishBanner.Character,Rarity.Four,0.4999,characters,weapons)
      val weaponFour = rewardCandidates(WishBanner.Character,Rarity.Four,0.5,characters,weapons)
      assert(charFive.nonEmpty && charFour.nonEmpty && weaponFour.nonEmpty)
      assert(charFive.forall { case WishReward.Character(_,Rarity.Five)=>true;case _=>false })
      assert(charFour.forall { case WishReward.Character(_,Rarity.Four)=>true;case _=>false })
      assert(weaponFour.forall { case WishReward.Weapon(_,Rarity.Four)=>true;case _=>false })
      assert(rewardCandidates(WishBanner.Character,Rarity.Three,0,characters,weapons).forall { case WishReward.Weapon(_,Rarity.Three)=>true;case _=>false })
      assert(Rarity.values.toList.forall(r=>rewardCandidates(WishBanner.Weapon,r,0,characters,weapons).size==5))
      assert(Rarity.fromInt(2).isLeft && Rarity.fromInt(6).isLeft)
      val simulated = (1 to 90).foldLeft((zero,List.empty[Rarity])) { case ((pity,rewards),_)=>
        val rarity = drawRarity(rules.character,pity,0.999999)
        (nextWishPity(pity,rarity),rewards :+ rarity)
      }
      assert(simulated._2(9)==Rarity.Four && simulated._2.last==Rarity.Five)
      assert(simulated._2.sliding(10).forall(_.exists(_!=Rarity.Three)))
    }
    _ <- IO.println("PASS: 基础概率区间、两池软/硬保底边界、五星优先与四星顺延、计数重置、角色/武器候选隔离和稀有度解码")
  yield ()
