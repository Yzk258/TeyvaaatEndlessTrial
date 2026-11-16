import {weapons} from '../../objects/Weapon';
import {artifacts} from '../../objects/Artifact';
import type {Profile} from '../../objects/Profile';
import type {EquipmentKind} from '../functions/equipmentInventory';
import {nextWeaponSerial} from '../functions/weaponInventory';

export function dismantleQuote(profile:Profile,kind:EquipmentKind,id:string){
 const isWeapon=kind==='weapon';
 const weapon=isWeapon?profile.weapons.find(item=>item.id===id):undefined;
 const artifact=isWeapon?undefined:profile.artifacts.find(item=>item.id===id);
 const owned=weapon??artifact;
 const definition=isWeapon?weapons.find(item=>item.id===weapon?.weaponId):artifacts.find(item=>item.id===artifact?.artifactId);
 const label=isWeapon?'武器':'圣遗物';
 if(!owned||!definition)throw new Error('尚未拥有该'+label);
 const equipped=isWeapon?profile.equipment.some(entry=>entry.weaponInstanceId===id):
  profile.artifactEquipment.some(entry=>entry.artifactInstanceId===id);
 if(equipped)throw new Error('请先卸下该'+label+'再分解');
 const upgrades=isWeapon?owned.level-1:owned.level;
 return {kind,id,definitionId:definition.id,label,name:definition.name,level:owned.level,
  mora:20*definition.rarity+Math.floor(upgrades*definition.levelUpCost/2)};
}

export type DismantleQuote=ReturnType<typeof dismantleQuote>;

export function dismantleEquipment(profile:Profile,quote:DismantleQuote):Profile{
 const current=dismantleQuote(profile,quote.kind,quote.id);
 if(current.level!==quote.level||current.mora!==quote.mora||current.definitionId!==quote.definitionId){
  throw new Error('物品状态已变化，请重新确认分解');
 }
 const mora=profile.mora+current.mora;
 if(!Number.isSafeInteger(mora))throw new Error('摩拉数量超出上限');
 const history=profile.dismantledEquipment??{weapon:[],artifact:[]};
 const ids=history[current.kind];
 const dismantledEquipment=ids.includes(current.definitionId)?history:{...history,[current.kind]:[...ids,current.definitionId]};
 return current.kind==='weapon'?{
  ...profile,mora,dismantledEquipment,nextWeaponSerial:nextWeaponSerial(profile),
  weapons:profile.weapons.filter(item=>item.id!==current.id)
 }:{
  ...profile,mora,dismantledEquipment,
  artifacts:profile.artifacts.filter(item=>item.id!==current.id)
 };
}
