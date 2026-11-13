import {artifacts,artifactRarities,type ArtifactSlot} from '../../objects/Artifact';
import {characters} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';

export function levelUpArtifact(profile:Profile,instanceId:string):Profile{
 const owned=profile.artifacts.find(item=>item.id===instanceId);
 const definition=artifacts.find(item=>item.id===owned?.artifactId);
 if(!owned||!definition)throw new Error('尚未拥有该圣遗物');
 if(owned.level>=artifactRarities[definition.rarity].maxLevel)throw new Error('已达到等级上限');
 if(profile.mora<definition.levelUpCost)throw new Error('摩拉不足');
 return {...profile,mora:profile.mora-definition.levelUpCost,
  artifacts:profile.artifacts.map(item=>item.id===instanceId?{...item,level:item.level+1}:item)};
}

export function equipArtifact(profile:Profile,characterId:string,slot:ArtifactSlot,instanceId:string|null):Profile{
 if(!characters.some(item=>item.id===characterId)||!profile.characters.some(item=>item.id===characterId))throw new Error('尚未拥有该角色');
 const assigned=profile.artifactEquipment;
 if(instanceId!==null){
  const owned=profile.artifacts.find(item=>item.id===instanceId);
  const definition=artifacts.find(item=>item.id===owned?.artifactId);
  if(!definition)throw new Error('尚未拥有该圣遗物');
  if(definition.slot!==slot)throw new Error('圣遗物部位不匹配');
  if(assigned.some(entry=>entry.artifactInstanceId===instanceId&&entry.characterId!==characterId))throw new Error('该圣遗物已被其他角色装备');
 }
 const slotIds=new Set(artifacts.filter(item=>item.slot===slot).map(item=>item.id));
 const instancesInSlot=new Set(profile.artifacts.filter(item=>slotIds.has(item.artifactId)).map(item=>item.id));
 const remaining=assigned.filter(entry=>entry.characterId!==characterId||!instancesInSlot.has(entry.artifactInstanceId));
 return {...profile,artifactEquipment:instanceId===null?remaining:[...remaining,{characterId,artifactInstanceId:instanceId}]};
}
