package services.system.api
import cats.effect.IO
import cats.syntax.all.*
import java.sql.Connection
import services.system.objects.SchemaVersion
import services.system.tables.schema.{SchemaVersionTable,SchemaVersionTableInitializer}
import services.identity.tables.user.UserTableInitializer
import services.economy.tables.wallet.WalletTableInitializer
import services.economy.tables.ledger.LedgerTableInitializer
import services.characters.tables.character.CharacterTableInitializer
import services.wishes.tables.pity.PityTableInitializer
import services.system.tables.receipt.ReceiptTableInitializer
import services.runs.tables.run.RunTableInitializer
import services.weapons.tables.weapon.WeaponTableInitializer
import services.weapons.tables.equipment.EquipmentTableInitializer
import services.wishes.tables.weaponpity.WeaponPityTableInitializer
import services.wishes.tables.bannerpity.BannerPityTableInitializer
import services.runs.tables.challenge.ChallengeTableInitializer
final case class InitializeDatabaseMessage() extends NoRequestMessage[Unit]:
  override def plan(connection: Connection): IO[Unit] =
    for
      _ <- SchemaVersionTable.lockInitialization(connection)
      _ <- SchemaVersionTableInitializer.initialize(connection)
      _ <- UserTableInitializer.initialize(connection)
      _ <- services.identity.tables.account.AccountTableInitializer.initialize(connection)
      _ <- services.identity.tables.session.SessionTableInitializer.initialize(connection)
      _ <- services.identity.tables.loginattempt.LoginAttemptTableInitializer.initialize(connection)
      _ <- services.identity.tables.roleaudit.RoleAuditTableInitializer.initialize(connection)
      _ <- WalletTableInitializer.initialize(connection)
      _ <- CharacterTableInitializer.initialize(connection)
      _ <- PityTableInitializer.initialize(connection)
      _ <- RunTableInitializer.initialize(connection)
      _ <- LedgerTableInitializer.initialize(connection)
      _ <- ReceiptTableInitializer.initialize(connection)
      _ <- WeaponTableInitializer.initialize(connection)
      _ <- EquipmentTableInitializer.initialize(connection)
      _ <- WeaponPityTableInitializer.initialize(connection)
      _ <- BannerPityTableInitializer.initialize(connection)
      rarityVersion = SchemaVersion("wish-rarity.v2")
      rarityMigrated <- SchemaVersionTable.contains(connection,rarityVersion)
      _ <- IO.unlessA(rarityMigrated)(BannerPityTableInitializer.migrateLegacy(connection) *> SchemaVersionTable.record(connection,rarityVersion))
      _ <- ChallengeTableInitializer.initialize(connection)
      _ <- services.runs.tables.adventure.AdventureTableInitializer.initialize(connection)
      baseline = SchemaVersion("baseline.v1")
      recorded <- SchemaVersionTable.contains(connection,baseline)
      _ <- IO.unlessA(recorded)(SchemaVersionTable.record(connection,baseline))
    yield ()
