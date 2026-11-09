package services.content.utils
import services.content.objects.AttackPattern
private[content] def validAttackPattern(pattern: AttackPattern): Boolean = pattern match
  case AttackPattern.Projectile(p) => p.speed.isFinite && p.speed>0 && p.radius.isFinite && p.radius>0 && p.pierce>=0
  case AttackPattern.MeleeArc(p) => p.angleDegrees.isFinite && p.angleDegrees>0 && p.angleDegrees<=360
  case AttackPattern.Area(p) => p.splashRadius.isFinite && p.splashRadius>0
