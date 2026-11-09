import type {WeaponTalent} from '../../objects/Weapon';
export type Projectile={readonly id:number;readonly x:number;readonly y:number;readonly dx:number;readonly dy:number;readonly originX:number;readonly originY:number;readonly remainingRange:number;readonly radius:number;readonly remainingHits:number;readonly hitIds:readonly number[];readonly damage:number;readonly talent:WeaponTalent|null};
