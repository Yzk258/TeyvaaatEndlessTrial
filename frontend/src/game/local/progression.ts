import adventureRules from '../../../../shared/adventure-rules.json';
import wishRules from '../../../../shared/wish-rules.json';
import {characters} from '../../objects/Character';
import {weapons} from '../../objects/Weapon';
import {adventureDifficulties,type AdventureSettings} from '../../objects/AdventureSettings';
import {arenaMaps,defaultEndlessMapId,endlessMaps} from '../../objects/BattleMap';
import type {Profile,RunStart,WishResult} from '../../objects/Profile';
import type {Rarity} from '../../objects/Rarity';
import {stages} from '../../objects/Stage';
import type {TrialReward} from '../../objects/TrialReward';
import type {WishBanner,WishCount,WishPull,WishPulls,WishReward} from '../../objects/WishReward';
import {adventureReward} from '../functions/adventureProgress';
import {equippedWeaponLoadout} from '../functions/weaponInventory';
import {equippedArtifactLoadout} from '../functions/artifactStats';
import {beginnerArtifacts} from '../../objects/Artifact';
import type {LocalSave} from './LocalSave';

export function selectCharacter(save:LocalSave,id:string):LocalSave{
 if(!save.profile.characters.some(character=>character.id===id)||!characters.some(character=>character.id===id)){
  throw new Error('尚未拥有该角色');
 }
 return {...save,selected:id};
}

export function setCharacterFavorite(save:LocalSave,id:string,favorite:boolean):LocalSave{
 if(!save.profile.characters.some(character=>character.id===id)||!characters.some(character=>character.id===id)){
  throw new Error('尚未拥有该角色');
 }
 if(save.favoriteCharacters.includes(id)===favorite)return save;
 return {...save,favoriteCharacters:favorite?[id,...save.favoriteCharacters]:save.favoriteCharacters.filter(entry=>entry!==id)};
}

export function levelUp(profile:Profile,kind:'character'|'weapon',id:string):Profile{
 const character=kind==='character'?profile.characters.find(entry=>entry.id===id):undefined;
 const weapon=kind==='weapon'?profile.weapons.find(entry=>entry.id===id):undefined;
 const owned=character??weapon;
 const definition=kind==='character'?characters.find(entry=>entry.id===id):weapons.find(entry=>entry.id===weapon?.weaponId);
 if(!definition||!owned)throw new Error(kind==='character'?'尚未拥有该角色':'尚未拥有该武器');
 if(owned.level>=definition.maxLevel)throw new Error('已达到等级上限');
 if(profile.mora<definition.levelUpCost)throw new Error('摩拉不足');
 const leveled={...profile,mora:profile.mora-definition.levelUpCost};
 const upgrade=<T extends {readonly id:string;readonly level:number}>(entry:T)=>entry.id===id?{...entry,level:entry.level+1}:entry;
 return kind==='character'?{...leveled,characters:profile.characters.map(upgrade)}:{...leveled,weapons:profile.weapons.map(upgrade)};
}

export function equipWeapon(profile:Profile,characterId:string,weaponInstanceId:string|null):Profile{
 const character=characters.find(entry=>entry.id===characterId);
 if(!character||!profile.characters.some(entry=>entry.id===characterId))throw new Error('尚未拥有该角色');
 const equipment=profile.equipment.filter(entry=>entry.characterId!==characterId);
 if(weaponInstanceId===null)return {...profile,equipment};
 const owned=profile.weapons.find(entry=>entry.id===weaponInstanceId);
 const weapon=weapons.find(entry=>entry.id===owned?.weaponId);
 if(!weapon)throw new Error('尚未拥有该武器');
 if(weapon.weapon!==character.weapon)throw new Error('武器类型与角色不匹配');
 if(equipment.some(entry=>entry.weaponInstanceId===weaponInstanceId))throw new Error('这把武器已被其他角色装备，请先卸下');
 return {...profile,equipment:[...equipment,{characterId,weaponInstanceId}]};
}

function nextWeaponInstanceId(profile:Profile):string{
 const ids=new Set(profile.weapons.map(entry=>entry.id));
 let serial=profile.weapons.length+1;
 while(ids.has('weapon-'+serial))serial++;
 return 'weapon-'+serial;
}

function tierProbability(base:number,count:number,softStart:number,softStep:number,hardPity:number){
 return count+1>=hardPity?1:Math.min(1,base+Math.max(0,count+2-softStart)*softStep);
}

export function performWish(profile:Profile,banner:WishBanner,random:()=>number=Math.random):WishResult{
 if(profile.intertwinedFates<1)throw new Error('纠缠之缘不足，需要 1 个纠缠之缘');
 const rules=wishRules[banner];
 const fiveKey=banner==='character'?'pity':'weaponPity';
 const fourKey=banner==='character'?'fourStarPity':'weaponFourStarPity';
 const five=tierProbability(rules.fiveBaseRate,profile[fiveKey],rules.fiveSoftStart,rules.fiveSoftStep,rules.fiveHardPity);
 const four=tierProbability(rules.fourBaseRate,profile[fourKey],rules.fourSoftStart,rules.fourSoftStep,rules.fourHardPity);
 const roll=random();
 const rarity:Rarity=roll<five?5:roll<Math.min(1,five+four)?4:3;
 const category=random();
 const candidates:WishReward[]=banner==='character'&&(rarity===5||(rarity===4&&category<0.5))
  ?characters.filter(entry=>entry.inStandardBanner&&entry.rarity===rarity)
    .map(entry=>({kind:'character',id:entry.id,rarity:entry.rarity}))
  :weapons.filter(entry=>entry.rarity===rarity).map(entry=>({kind:'weapon',id:entry.id,rarity:entry.rarity}));
 const reward=candidates[Math.floor(random()*candidates.length)];
 if(!reward)throw new Error('该星级暂无可用奖励，请检查卡池配置');
 const duplicate=reward.kind==='character'
  ?profile.characters.some(entry=>entry.id===reward.id)
  :profile.weapons.some(entry=>entry.weaponId===reward.id);
 const inventory=reward.kind==='character'?{
  characters:duplicate?profile.characters.map(entry=>entry.id===reward.id?{...entry,copies:entry.copies+1}:entry)
   :[...profile.characters,{id:reward.id,level:1,copies:1}]
 }:{weapons:[...profile.weapons,{id:nextWeaponInstanceId(profile),weaponId:reward.id,level:1}]};
 return {reward,duplicate,profile:{
  ...profile,...inventory,intertwinedFates:profile.intertwinedFates-1,
  [fiveKey]:rarity===5?0:profile[fiveKey]+1,
  [fourKey]:rarity===4?0:Math.min(rules.fourHardPity-1,profile[fourKey]+1)
 }};
}

export function performWishes(profile:Profile,banner:WishBanner,count:WishCount,random:()=>number=Math.random):{profile:Profile;pulls:WishPulls}{
 if(profile.intertwinedFates<count)throw new Error('纠缠之缘不足，需要 '+count+' 个纠缠之缘');
 const first=performWish(profile,banner,random);
 let updatedProfile=first.profile;
 const pulls:[WishPull,...WishPull[]]=[{reward:first.reward,duplicate:first.duplicate}];
 for(let index=1;index<count;index++){
  const next=performWish(updatedProfile,banner,random);
  pulls.push({reward:next.reward,duplicate:next.duplicate});
  updatedProfile=next.profile;
 }
 return {profile:updatedProfile,pulls};
}

export function requestWishes(profile:Profile,banner:WishBanner,count:WishCount,approvedCost:number,random:()=>number=Math.random){
 const missingFates=Math.max(0,count-profile.intertwinedFates);
 const primogemCost=missingFates*wishRules.cost;
 if(primogemCost>approvedCost||primogemCost>profile.primogems){
  return {kind:'exchange' as const,missingFates,primogemCost};
 }
 const funded=missingFates===0?profile:{
  ...profile,primogems:profile.primogems-primogemCost,intertwinedFates:profile.intertwinedFates+missingFates
 };
 return {kind:'drawn' as const,...performWishes(funded,banner,count,random)};
}

type Trial={readonly kind:'stage';readonly stageId:string}|{readonly kind:'adventure';readonly settings:AdventureSettings};

export function startTrial(save:LocalSave,trial:Trial):RunStart{
 const character=characters.find(entry=>entry.id===save.selected);
 const owned=save.profile.characters.find(entry=>entry.id===save.selected);
 if(!character||!owned)throw new Error('请选择已拥有的角色');
 const loadout={
  runId:crypto.randomUUID(),seed:Math.floor(Math.random()*0x7fffffff),level:owned.level,character,
  equippedWeapon:equippedWeaponLoadout(save.profile,character),equippedArtifacts:equippedArtifactLoadout(save.profile,character.id)
 };
 if(trial.kind==='stage'){
  const stage=stages.find(entry=>entry.id===trial.stageId);
  if(!stage)throw new Error('关卡不存在');
  return {...loadout,stage,stageDifficulty:adventureDifficulties[stage.difficulty],adventure:null,map:arenaMaps[stage.mapId]};
 }
 const difficultyId=trial.settings.difficulty;
 if(!Object.hasOwn(adventureDifficulties,difficultyId))throw new Error('请选择有效的战斗难度');
 const mapId=trial.settings.mapId??defaultEndlessMapId;
 if(!Object.hasOwn(endlessMaps,mapId))throw new Error('无尽地图不存在');
 return {...loadout,stage:null,adventure:{difficulty:adventureDifficulties[difficultyId],rules:adventureRules},map:endlessMaps[mapId]};
}

export function trialRewards(run:RunStart,kills:number,ticks:number):readonly TrialReward[]{
 if(run.stage)return kills===run.stage.enemies?run.stage.rewards:[];
 const {mora,primogems}=adventureReward(run.adventure,kills,ticks);
 return [{kind:'currency',currency:'mora',amount:mora},{kind:'currency',currency:'primogems',amount:primogems}];
}

export function settleTrial(save:LocalSave,run:RunStart,kills:number,ticks:number,artifactDrops:readonly string[]=[]):LocalSave{
 if(!Number.isSafeInteger(kills)||kills<0||!Number.isSafeInteger(ticks)||ticks<0||
  (run.stage&&(kills>run.stage.enemies||ticks===0||artifactDrops.length>0))||
  artifactDrops.length>kills||artifactDrops.some(id=>!beginnerArtifacts.some(item=>item.id===id))){
  throw new Error('本局战果无效');
 }
 const existing=save.results.find(result=>result.runId===run.runId);
 if(existing){
  const previousDrops=existing.artifactDrops??[];
  if(existing.kills!==kills||existing.ticks!==ticks||previousDrops.length!==artifactDrops.length||previousDrops.some((id,index)=>id!==artifactDrops[index]))throw new Error('该试炼已结算');
  return save;
 }
 const profile=trialRewards(run,kills,ticks).reduce<Profile>((current,reward)=>{
  switch(reward.kind){
   case 'currency':return {...current,[reward.currency]:current[reward.currency]+reward.amount};
  }
 },save.profile);
 const droppedArtifacts=artifactDrops.map((artifactId,index)=>({id:`drop-${run.runId}-${index+1}`,artifactId,level:0}));
 if(droppedArtifacts.some(item=>profile.artifacts.some(existing=>existing.id===item.id)))throw new Error('圣遗物副本编号重复');
 const cleared=run.stage&&kills===run.stage.enemies&&!save.clearedStages.includes(run.stage.id);
 return {...save,
  profile:{...profile,artifacts:droppedArtifacts.length?[...profile.artifacts,...droppedArtifacts]:profile.artifacts,runs:profile.runs+1},
  clearedStages:cleared&&run.stage?[...save.clearedStages,run.stage.id]:save.clearedStages,
  results:[...save.results,{runId:run.runId,kills,ticks,...(artifactDrops.length?{artifactDrops:[...artifactDrops]}:{})}]
 };
}
