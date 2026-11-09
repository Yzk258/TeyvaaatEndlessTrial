import type {Enemy} from './BattleState';
import type {Projectile} from './Projectile';
import type {AttackEffect} from './AttackEffect';
import type {AttackCue} from './AttackCue';
import type {HitEffect} from './HitEffect';
export type AttackResolution={readonly queuedAttackTicks:readonly number[];readonly enemies:readonly Enemy[];readonly projectiles:readonly Projectile[];readonly effects:readonly AttackEffect[];readonly attackCue:AttackCue|null;readonly hits:readonly HitEffect[]};
