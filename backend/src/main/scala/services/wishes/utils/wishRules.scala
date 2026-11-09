package services.wishes.utils
import services.content.objects.{Rarity,WishBannerRules,CharacterDefinition,WeaponDefinition}
import services.wishes.objects.{WishBanner,WishPity,WishReward}

private[wishes] def tierProbability(base: Double, count: Int, softStart: Int, softStep: Double, hardPity: Int): Double =
  if count+1>=hardPity then 1.0 else math.min(1.0,base+math.max(0,count+2-softStart)*softStep)

private[wishes] def drawRarity(rules: WishBannerRules, pity: WishPity, roll: Double): Rarity =
  val five = tierProbability(rules.fiveBaseRate,pity.five,rules.fiveSoftStart,rules.fiveSoftStep,rules.fiveHardPity)
  val four = tierProbability(rules.fourBaseRate,pity.four,rules.fourSoftStart,rules.fourSoftStep,rules.fourHardPity)
  if roll<five then Rarity.Five else if roll<math.min(1.0,five+four) then Rarity.Four else Rarity.Three

private[wishes] def nextWishPity(pity: WishPity, rarity: Rarity): WishPity = rarity match
  case Rarity.Three => WishPity(math.min(9,pity.four+1),pity.five+1)
  case Rarity.Four => WishPity(0,pity.five+1)
  case Rarity.Five => WishPity(math.min(9,pity.four+1),0)

private[wishes] def rewardCandidates(banner: WishBanner, rarity: Rarity, categoryRoll: Double, characters: List[CharacterDefinition], weapons: List[WeaponDefinition]): List[WishReward] =
  val characterReward = banner==WishBanner.Character && (rarity==Rarity.Five || rarity==Rarity.Four && categoryRoll<0.5)
  if characterReward then characters.filter(c=>c.inStandardBanner && c.rarity==rarity).map(c=>WishReward.Character(c.id,c.rarity))
  else weapons.filter(_.rarity==rarity).map(w=>WishReward.Weapon(w.id,w.rarity))
