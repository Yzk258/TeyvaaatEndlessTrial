import type {Profile} from '../../objects/Profile';

export type EquipmentKind='weapon'|'artifact';
export const equipmentCapacity={weapon:500,artifact:1000} as const;

export function equipmentUsage(profile:Profile){
 return [
  {kind:'weapon',label:'武器',count:profile.weapons.length,capacity:equipmentCapacity.weapon},
  {kind:'artifact',label:'圣遗物',count:profile.artifacts.length,capacity:equipmentCapacity.artifact}
 ] as const;
}

export function hasNewOverflow(profile:Profile,previous:Profile|undefined):boolean{
 const previousCounts={weapon:previous?.weapons.length??0,artifact:previous?.artifacts.length??0};
 return equipmentUsage(profile).some(({kind,count,capacity})=>count>capacity&&count>previousCounts[kind]);
}
