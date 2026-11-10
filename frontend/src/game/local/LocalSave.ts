import {characters,type CharacterId} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';

export type TrialResult={readonly runId:string;readonly kills:number;readonly ticks:number};
export type LocalSave={
 readonly version:1;
 readonly id:string;
 readonly nickname:string;
 readonly updatedAt:number;
 readonly selected:CharacterId;
 readonly profile:Profile;
 readonly clearedStages:readonly string[];
 readonly results:readonly TrialResult[];
 readonly checkIns:number;
};

export const starterCharacter:CharacterId='amber';

export function createSave(nickname:string):LocalSave{
 const name=nickname.trim();
 if(name.length<1||name.length>30)throw new Error('存档名称需为 1 至 30 个字符');
 return {
  version:1,id:crypto.randomUUID(),nickname:name,updatedAt:Date.now(),selected:starterCharacter,
  profile:{
   primogems:1600,mora:5000,intertwinedFates:10,characters:[{id:starterCharacter,level:1,copies:1}],
   weapons:[],equipment:[],runs:0,pity:0,fourStarPity:0,weaponPity:0,weaponFourStarPity:0
  },
  clearedStages:[],results:[],checkIns:0
 };
}

function record(value:unknown):value is Record<string,unknown>{
 return typeof value==='object'&&value!==null&&!Array.isArray(value);
}
function count(value:unknown,min=0):value is number{
 return typeof value==='number'&&Number.isSafeInteger(value)&&value>=min;
}
function id(value:unknown):value is string{
 return typeof value==='string'&&value.length>0&&value.length<=150;
}
function owned(value:unknown):value is {id:string;level:number;copies:number}{
 return record(value)&&id(value.id)&&count(value.level,1)&&count(value.copies,1);
}
function validProfile(value:unknown):value is Profile{
 if(!record(value))return false;
 const {characters:ownedCharacters,weapons,equipment}=value;
 if(!Array.isArray(ownedCharacters)||!ownedCharacters.every(owned)||
  !Array.isArray(weapons)||!weapons.every(owned)||!Array.isArray(equipment))return false;
 const characterIds=new Set(ownedCharacters.map(entry=>entry.id));
 const weaponIds=new Set(weapons.map(entry=>entry.id));
 if(characterIds.size!==ownedCharacters.length||weaponIds.size!==weapons.length||
  !characters.some(character=>characterIds.has(character.id)))return false;
 if(!equipment.every(entry=>record(entry)&&id(entry.characterId)&&characterIds.has(entry.characterId)&&
  id(entry.weaponId)&&weaponIds.has(entry.weaponId)))return false;
 if(new Set(equipment.map(entry=>entry.characterId)).size!==equipment.length||
  new Set(equipment.map(entry=>entry.weaponId)).size!==equipment.length)return false;
 return ['primogems','mora','intertwinedFates','runs','pity','fourStarPity','weaponPity','weaponFourStarPity']
  .every(key=>count(value[key]));
}

export function readSaveData(value:unknown):LocalSave{
 if(!record(value)||value.version!==1)throw new Error('不支持此存档版本');
 const {nickname,selected,profile,clearedStages,results}=value;
 const checkIns=value.checkIns??0;
 if(!id(value.id)||typeof nickname!=='string'||!nickname.trim()||nickname.length>30||
  !count(value.updatedAt)||!id(selected)||!validProfile(profile)||
  !Array.isArray(clearedStages)||!clearedStages.every(id)||
  !count(checkIns)||checkIns>7||
  !Array.isArray(results)||!results.every(result=>record(result)&&id(result.runId)&&count(result.kills)&&count(result.ticks))||
  new Set(results.map(result=>result.runId)).size!==results.length){
  throw new Error('存档数据不完整或格式有误');
 }
 const available=characters.filter(character=>profile.characters.some(entry=>entry.id===character.id));
 const active=available.find(character=>character.id===selected)
  ??available.find(character=>character.id===starterCharacter)??available[0];
 return {version:1,id:value.id,nickname,updatedAt:value.updatedAt,selected:active.id,profile,clearedStages,results,checkIns};
}
