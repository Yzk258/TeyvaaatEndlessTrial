import definitions from '../../../shared/weapons.json';
import {weaponLabels,type WeaponType} from './WeaponType';
import {isRarity,type Rarity} from './Rarity';
export type WeaponStatKind='attackFlat'|'attackPercent'|'hpFlat'|'hpPercent'|'attackSpeedPercent'|'attackRangeFlat';
export type WeaponStat={readonly kind:WeaponStatKind;readonly base:number;readonly growth:number};
export type WeaponTalent={readonly name:string;readonly description:string;readonly condition:'always'|'near'|'far'|'reaction';readonly threshold:number;readonly damageBonusPercent:number};
export type Weapon={readonly id:string;readonly name:string;readonly weapon:WeaponType;readonly symbol:string;readonly mainStat:WeaponStat;readonly subStat:WeaponStat;readonly talent:WeaponTalent;readonly maxLevel:number;readonly levelUpCost:number;readonly rarity:Rarity};
export type OwnedWeapon={readonly id:string;readonly level:number;readonly copies:number};
export type Equipment={readonly characterId:string;readonly weaponId:string};
export type WeaponLoadout={readonly definition:Weapon;readonly level:number};
export type WeaponWishResult=import('./Profile').WishResult;
export const statLabels:Readonly<Record<WeaponStatKind,string>>={attackFlat:'攻击力',attackPercent:'攻击加成',hpFlat:'生命值',hpPercent:'生命加成',attackSpeedPercent:'攻击速度',attackRangeFlat:'攻击范围'};
function isWeapon(w:typeof definitions[number]):w is typeof definitions[number]&Weapon {
 return isRarity(w.rarity)&&Object.hasOwn(weaponLabels,w.weapon)&&[w.mainStat,w.subStat].every(s=>Object.hasOwn(statLabels,s.kind)&&s.base>=0&&s.growth>=0)&&['always','near','far','reaction'].includes(w.talent.condition)&&w.talent.threshold>=0&&w.talent.damageBonusPercent>=0&&w.maxLevel>=1&&w.levelUpCost>=0;
}
if(!definitions.every(isWeapon)||new Set(definitions.map(w=>w.id)).size!==definitions.length)throw new Error('武器配置无效');
export const weapons:readonly Weapon[]=definitions;
