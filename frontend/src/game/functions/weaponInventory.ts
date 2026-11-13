import type {Character} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';
import {weapons,type OwnedWeapon,type Weapon,type WeaponLoadout} from '../../objects/Weapon';

export function groupOwnedWeapons(items:readonly OwnedWeapon[]):ReadonlyMap<string,readonly OwnedWeapon[]>{
 const groups=new Map<string,OwnedWeapon[]>();
 for(const item of items){
  const group=groups.get(item.weaponId);
  if(group)group.push(item);
  else groups.set(item.weaponId,[item]);
 }
 return groups;
}

export function weaponDefinitionsByOwnership(groups:ReadonlyMap<string,readonly OwnedWeapon[]>):readonly Weapon[]{
 const owned=(weapon:Weapon)=>Number((groups.get(weapon.id)?.length??0)>0);
 return weapons.toSorted((first,second)=>owned(second)-owned(first));
}

export function equippedWeaponLoadout(profile:Profile,character:Character):WeaponLoadout|null{
 const instanceId=profile.equipment.find(entry=>entry.characterId===character.id)?.weaponInstanceId;
 const owned=profile.weapons.find(entry=>entry.id===instanceId);
 const definition=weapons.find(entry=>entry.id===owned?.weaponId&&entry.weapon===character.weapon);
 return owned&&definition?{definition,level:owned.level}:null;
}
