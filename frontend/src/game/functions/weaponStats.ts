import type {WeaponLoadout,WeaponStat,WeaponStatKind,WeaponTalent} from '../../objects/Weapon';
export function weaponStatValue(stat:WeaponStat,level:number):number{return Math.round((stat.base+(level-1)*stat.growth)*100)/100;}
export function formatWeaponStat(stat:WeaponStat,level:number):string {
 const value=weaponStatValue(stat,level);
 return '+'+value+(stat.kind.endsWith('Percent')?'%':'');
}
export function applyWeaponStats(base:{readonly attack:number;readonly maxHp:number;readonly attackRange:number;readonly attackIntervalTicks:number},loadout:WeaponLoadout|null){
 const stats=loadout?[loadout.definition.mainStat,loadout.definition.subStat]:[];
 const value=(kind:WeaponStatKind)=>stats.filter(s=>s.kind===kind).reduce((sum,s)=>sum+weaponStatValue(s,loadout!.level),0);
 return {
  attack:Math.round((base.attack+value('attackFlat'))*(1+value('attackPercent')/100)*100)/100,
  maxHp:Math.round((base.maxHp+value('hpFlat'))*(1+value('hpPercent')/100)),
  attackRange:base.attackRange+value('attackRangeFlat'),
  attackIntervalTicks:Math.max(1,Math.round(base.attackIntervalTicks/(1+value('attackSpeedPercent')/100)))
 };
}
export function weaponDamage(base:number,talent:WeaponTalent|null,distance:number,reactionTriggered:boolean):number {
 if(!talent)return base;
 const active=(()=>{switch(talent.condition){
  case 'always':return true;
  case 'near':return distance<=talent.threshold;
  case 'far':return distance>=talent.threshold;
  case 'reaction':return reactionTriggered;
 }})();
 return Math.round(base*(active?1+talent.damageBonusPercent/100:1)*100)/100;
}
