type ContactAttack={readonly kind:'contact';readonly reach:number};
type RangedAttack={readonly kind:'ranged';readonly projectile:'arrow'|'stone'|'fireball';readonly range:number;readonly standOff:number;readonly cooldown:number;readonly speed:number;readonly radius:number};
type EnemyDefinition={readonly hp:number;readonly damage:number;readonly experience:number;readonly radius:number;readonly attack:ContactAttack|RangedAttack};

export const enemyDefinitions={
 slime:{hp:2,damage:4,experience:5,radius:14,attack:{kind:'contact',reach:22}},
 hilichurl:{hp:5,damage:4,experience:12,radius:18,attack:{kind:'contact',reach:22}},
 shooter:{hp:5,damage:4,experience:12,radius:18,attack:{kind:'ranged',projectile:'arrow',range:220,standOff:150,cooldown:36,speed:10,radius:3}},
 samachurl:{hp:6,damage:5,experience:16,radius:18,attack:{kind:'ranged',projectile:'stone',range:200,standOff:135,cooldown:44,speed:7,radius:5}},
 abyssMage:{hp:8,damage:6,experience:20,radius:18,attack:{kind:'ranged',projectile:'fireball',range:255,standOff:175,cooldown:50,speed:8,radius:6}},
 whopperflower:{hp:5,damage:4,experience:12,radius:18,attack:{kind:'contact',reach:22}},
 boss:{hp:60,damage:8,experience:100,radius:30,attack:{kind:'contact',reach:29}},
 elite:{hp:100,damage:12,experience:160,radius:34,attack:{kind:'contact',reach:36}}
} as const satisfies Readonly<Record<string,EnemyDefinition>>;

export type EnemyKind=keyof typeof enemyDefinitions;
export type Enemy={
 readonly id:number;readonly x:number;readonly y:number;readonly hp:number;readonly damage:number;readonly kind:EnemyKind;
 readonly nextAttackTick?:number;readonly attackCue?:Pick<AttackCue,'tick'|'angle'>;
};
export type EnemyProjectile={
 readonly id:number;readonly kind:RangedAttack['projectile'];readonly x:number;readonly y:number;readonly dx:number;readonly dy:number;
 readonly remainingRange:number;readonly radius:number;readonly damage:number;
};
import type {AttackCue} from './AttackCue';

