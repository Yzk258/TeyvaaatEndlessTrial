import {characters,type CharacterId} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';
import type {OwnedWeapon} from '../../objects/Weapon';
import {artifacts,artifactRarities,beginnerArtifacts,type ArtifactSlot,type OwnedArtifact} from '../../objects/Artifact';

export type TrialResult={readonly runId:string;readonly kills:number;readonly ticks:number;readonly artifactDrops?:readonly string[]};
export type LocalSave={
 readonly version:2;
 readonly id:string;
 readonly nickname:string;
 readonly updatedAt:number;
 readonly selected:CharacterId;
 readonly favoriteCharacters:readonly CharacterId[];
 readonly profile:Profile;
 readonly clearedStages:readonly string[];
 readonly results:readonly TrialResult[];
};

export const starterCharacter:CharacterId='amber';
const starterArtifacts=()=>beginnerArtifacts.map((item):OwnedArtifact=>({id:'starter-'+item.id,artifactId:item.id,level:0}));

export function createSave(nickname:string):LocalSave{
 const name=nickname.trim();
 if(name.length<1||name.length>30)throw new Error('存档名称需为 1 至 30 个字符');
 return {
  version:2,id:crypto.randomUUID(),nickname:name,updatedAt:Date.now(),selected:starterCharacter,favoriteCharacters:[],
  profile:{
   primogems:1600,mora:5000,intertwinedFates:10,characters:[{id:starterCharacter,level:1,copies:1}],
   weapons:[],equipment:[],runs:0,pity:0,fourStarPity:0,weaponPity:0,weaponFourStarPity:0,artifacts:starterArtifacts(),artifactEquipment:[]
  },
  clearedStages:[],results:[]
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
function countedItem(value:unknown):value is {id:string;level:number;copies:number}{
 return record(value)&&id(value.id)&&count(value.level,1)&&count(value.copies,1);
}
function ownedWeapon(value:unknown):value is OwnedWeapon{
 return record(value)&&id(value.id)&&id(value.weaponId)&&count(value.level,1);
}

function ownedArtifact(value:unknown):value is OwnedArtifact{
 if(!record(value)||!id(value.id)||!count(value.level))return false;
 const definition=artifacts.find(item=>item.id===value.artifactId);
 return !!definition&&value.level<=artifactRarities[definition.rarity].maxLevel;
}

function validArtifactEquipment(value:unknown,inventory:readonly OwnedArtifact[],characterIds:ReadonlySet<string>):boolean{
 if(!Array.isArray(value))return false;
 const items=new Map(inventory.map(item=>[item.id,item.artifactId]));
 const assigned=new Set<string>();
 const slotsByCharacter=new Map<string,Set<ArtifactSlot>>();
 return value.every(entry=>{
  if(!record(entry)||!id(entry.characterId)||!characterIds.has(entry.characterId)||!id(entry.artifactInstanceId)||assigned.has(entry.artifactInstanceId))return false;
  const artifactId=items.get(entry.artifactInstanceId);
  const definition=artifacts.find(item=>item.id===artifactId);
  if(!definition)return false;
  const slots=slotsByCharacter.get(entry.characterId)??new Set<ArtifactSlot>();
  if(slots.has(definition.slot))return false;
  assigned.add(entry.artifactInstanceId);
  slots.add(definition.slot);
  slotsByCharacter.set(entry.characterId,slots);
  return true;
 });
}

function migrateLegacyProfile(value:unknown):unknown{
 if(!record(value)||!Array.isArray(value.weapons)||!value.weapons.every(countedItem)||!Array.isArray(value.equipment))return null;
 if(new Set(value.weapons.map(weapon=>weapon.id)).size!==value.weapons.length)return null;
 // The aggregate format can encode more individual records than can safely be allocated.
 if(value.weapons.reduce((total,weapon)=>total+weapon.copies,0)>65536)throw new Error('旧存档的武器数量过大，无法展开为独立武器');
 const firstIds=new Map<string,string>();
 const weapons:OwnedWeapon[]=value.weapons.flatMap((weapon,index)=>{
  const prefix='legacy-weapon-'+(index+1)+'-';
  firstIds.set(weapon.id,prefix+'1');
  return Array.from({length:weapon.copies},(_,copy)=>({
   id:prefix+(copy+1),weaponId:weapon.id,level:copy===0?weapon.level:1
  }));
 });
 const equipment=value.equipment.map((entry:unknown)=>record(entry)&&id(entry.weaponId)?
  {characterId:entry.characterId,weaponInstanceId:firstIds.get(entry.weaponId)}:null);
 return {...value,weapons,equipment};
}

function validProfile(value:unknown):value is Profile{
 if(!record(value))return false;
 const {characters:ownedCharacters,weapons,equipment}=value;
 if(!Array.isArray(ownedCharacters)||!ownedCharacters.every(countedItem)||
  !Array.isArray(weapons)||!weapons.every(ownedWeapon)||!Array.isArray(equipment))return false;
 const characterIds=new Set(ownedCharacters.map(entry=>entry.id));
 const weaponIds=new Set(weapons.map(entry=>entry.id));
 if(characterIds.size!==ownedCharacters.length||weaponIds.size!==weapons.length||
  !characters.some(character=>characterIds.has(character.id)))return false;
 if(!equipment.every(entry=>record(entry)&&id(entry.characterId)&&characterIds.has(entry.characterId)&&
  id(entry.weaponInstanceId)&&weaponIds.has(entry.weaponInstanceId)))return false;
 if(new Set(equipment.map(entry=>entry.characterId)).size!==equipment.length||
  new Set(equipment.map(entry=>entry.weaponInstanceId)).size!==equipment.length)return false;
 if(!Array.isArray(value.artifacts)||!value.artifacts.every(ownedArtifact)||
  new Set(value.artifacts.map(item=>item.id)).size!==value.artifacts.length||!validArtifactEquipment(value.artifactEquipment,value.artifacts,characterIds))return false;
 return ['primogems','mora','intertwinedFates','runs','pity','fourStarPity','weaponPity','weaponFourStarPity']
  .every(key=>count(value[key]));
}

export function readSaveData(value:unknown):LocalSave{
 if(!record(value)||(value.version!==1&&value.version!==2))throw new Error('不支持此存档版本');
 const {nickname,selected,clearedStages,results}=value;
 const migrated=value.version===1?migrateLegacyProfile(value.profile):value.profile;
 const profile=record(migrated)&&!Object.hasOwn(migrated,'artifacts')&&!Object.hasOwn(migrated,'artifactEquipment')
  ?{...migrated,artifacts:starterArtifacts(),artifactEquipment:[]}:migrated;
 const favoriteCharacters=value.favoriteCharacters??[];
 if(!id(value.id)||typeof nickname!=='string'||!nickname.trim()||nickname.length>30||
  !count(value.updatedAt)||!id(selected)||!validProfile(profile)||
  !Array.isArray(clearedStages)||!clearedStages.every(id)||
  !Array.isArray(favoriteCharacters)||!favoriteCharacters.every(id)||
  !Array.isArray(results)||!results.every(result=>record(result)&&id(result.runId)&&count(result.kills)&&count(result.ticks)&&
   (result.artifactDrops===undefined||(Array.isArray(result.artifactDrops)&&result.artifactDrops.length<=result.kills&&result.artifactDrops.every(artifactId=>id(artifactId)))))||
  new Set(results.map(result=>result.runId)).size!==results.length){
  throw new Error('存档数据不完整或格式有误');
 }
 const available=characters.filter(character=>profile.characters.some(entry=>entry.id===character.id));
 const active=available.find(character=>character.id===selected)
  ??available.find(character=>character.id===starterCharacter)??available[0];
 const ownedIds=new Set(profile.characters.map(entry=>entry.id));
 const favorites=[...new Set(favoriteCharacters.filter(id=>ownedIds.has(id)))];
 return {version:2,id:value.id,nickname,updatedAt:value.updatedAt,selected:active.id,favoriteCharacters:favorites,profile,clearedStages,results};
}
