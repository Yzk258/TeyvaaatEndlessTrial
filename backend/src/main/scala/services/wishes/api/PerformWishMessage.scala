package services.wishes.api
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import java.security.SecureRandom
import io.circe.syntax.*
import io.circe.parser.decode
import services.system.api.APIMessage
import services.system.objects.DomainError
import services.identity.objects.UserId
import services.identity.tables.user.UserTable
import services.characters.objects.CharacterId
import services.characters.tables.character.CharacterTable
import services.weapons.objects.WeaponId
import services.weapons.tables.weapon.WeaponTable
import services.economy.tables.wallet.WalletTable
import services.economy.tables.ledger.LedgerTable
import services.economy.api.GetProfileMessage
import services.system.tables.receipt.ReceiptTable
import services.content.api.{ListWishRulesMessage,ListWeaponsMessage,ListCharactersMessage}
import services.wishes.objects.{WishBanner,WishReward}
import services.wishes.objects.apiTypes.WishResult
import services.wishes.tables.bannerpity.BannerPityTable
import services.wishes.utils.{drawRarity,nextWishPity,rewardCandidates}

final case class PerformWishMessage(userId: UserId, requestId: String) extends APIMessage[WishResult]:
  override def plan(connection: Connection): IO[WishResult] =
    for
      _ <- UserTable.lock(connection,userId)
      existing <- ReceiptTable.get(connection,userId,requestId,"wish","character-rarity-v2")
      result <- existing match
        case Some(saved) => IO.fromEither(decode[WishResult](saved))
        case None =>
          for
            rules <- ListWishRulesMessage().plan(connection)
            wallet <- WalletTable.get(connection,userId)
            _ <- IO.raiseWhen(wallet.intertwinedFates<1)(DomainError("纠缠之缘不足，需要1个纠缠之缘"))
            weapons <- ListWeaponsMessage().plan(connection)
            characters <- ListCharactersMessage().plan(connection)
            pity <- BannerPityTable.get(connection,userId,WishBanner.Character)
            random <- IO(new SecureRandom())
            rarityRoll <- IO(random.nextDouble())
            categoryRoll <- IO(random.nextDouble())
            rarity = drawRarity(rules.character,pity,rarityRoll)
            candidates = rewardCandidates(WishBanner.Character,rarity,categoryRoll,characters,weapons)
            _ <- IO.raiseWhen(candidates.isEmpty)(DomainError("该星级暂无可用奖励，请检查卡池配置"))
            index <- IO(random.nextInt(candidates.size))
            reward = candidates(index)
            duplicate <- reward match
              case WishReward.Character(id,_) => CharacterTable.list(connection,userId).map(_.exists(_.id==id))
              case WishReward.Weapon(id,_) => WeaponTable.list(connection,userId).map(_.exists(_.id==id))
            _ <- WalletTable.adjust(connection,userId,0,0,-1)
            _ <- LedgerTable.append(connection,userId,0,0,-1,"wish:"+requestId)
            _ <- reward match
              case WishReward.Character(id,_) => CharacterTable.grant(connection,userId,CharacterId(id))
              case WishReward.Weapon(id,_) => WeaponTable.grant(connection,userId,WeaponId(id))
            _ <- BannerPityTable.set(connection,userId,WishBanner.Character,nextWishPity(pity,rarity))
            profile <- GetProfileMessage(userId).plan(connection)
            result = WishResult(reward,duplicate,profile)
            _ <- ReceiptTable.save(connection,userId,requestId,"wish","character-rarity-v2",result.asJson.noSpaces)
          yield result
    yield result
