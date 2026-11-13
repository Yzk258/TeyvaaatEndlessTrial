import {artifacts,artifactSets,type ArtifactLoadout,type ArtifactSetId} from '../../objects/Artifact';
import type {Character} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';
import type {WeaponLoadout} from '../../objects/Weapon';
import {characterStats} from './characterStats';
import {applyWeaponStats} from './weaponStats';

export function equippedArtifactLoadout(profile:Profile,characterId:string):readonly ArtifactLoadout[]{
 return profile.artifactEquipment.filter(entry=>entry.characterId===characterId).flatMap(entry=>{
  const item=profile.artifacts.find(artifact=>artifact.id===entry.artifactInstanceId);
  const definition=artifacts.find(artifact=>artifact.id===item?.artifactId);
  return definition&&item?[{definition,level:item.level}]:[];
 });
}

export function artifactSetBonuses(loadout:readonly ArtifactLoadout[]){
 const counts=new Map<ArtifactSetId,number>();
 for(const {definition} of loadout)counts.set(definition.setId,(counts.get(definition.setId)??0)+1);
 return [...counts].flatMap(([setId,count])=>artifactSets[setId].bonuses.filter(bonus=>count>=bonus.pieces));
}

export function equippedCharacterStats(character:Character,level:number,weapon:WeaponLoadout|null,loadout:readonly ArtifactLoadout[]){
 const bonuses=artifactSetBonuses(loadout);
 const stats=loadout.map(item=>({stat:item.definition.mainStat,level:item.level+1}));
 for(const bonus of bonuses){
  if(bonus.kind==='attackPercent')stats.push({stat:{kind:'attackPercent',base:bonus.value,growth:0},level:1});
 }
 return {
  ...applyWeaponStats({...characterStats(character,level),attackRange:character.attackRange,attackIntervalTicks:character.attackIntervalTicks},weapon,stats),
  healOnKillPercent:bonuses.reduce((sum,bonus)=>sum+(bonus.kind==='healOnKillPercent'?bonus.value:0),0)
 };
}
