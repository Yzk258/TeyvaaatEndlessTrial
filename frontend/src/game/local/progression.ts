import adventureRules from '../../../../shared/adventure-rules.json';
import wishRules from '../../../../shared/wish-rules.json';
import {characters} from '../../objects/Character';
import {weapons} from '../../objects/Weapon';
import type {AdventureSettings} from '../../objects/AdventureSettings';
import type {Profile,RunStart,WishResult} from '../../objects/Profile';
import type {Rarity} from '../../objects/Rarity';
import {stages} from '../../objects/Stage';
import type {WishReward} from '../../objects/WishReward';
import {adventureReward} from '../functions/adventureProgress';
import type {LocalSave} from './LocalSave';

export function selectCharacter(save:LocalSave,id:string):LocalSave{
 if(!save.profile.characters.some(character=>character.id===id)||!characters.some(character=>character.id===id)){
  throw new Error('尚未拥有该角色');
 }
 return {...save,selected:id};
}

export function levelUp(profile:Profile,kind:'character'|'weapon',id:string):Profile{
 const definition=(kind==='character'?characters:weapons).find(entry=>entry.id===id);
 const key=kind==='character'?'characters':'weapons';
 const owned=profile[key].find(entry=>entry.id===id);
 if(!definition||!owned)throw new Error(kind==='character'?'尚未拥有该角色':'尚未拥有该武器');
 if(owned.level>=definition.maxLevel)throw new Error('已达到等级上限');
 if(profile.mora<definition.levelUpCost)throw new Error('摩拉不足');
 return {...profile,mora:profile.mora-definition.levelUpCost,
  [key]:profile[key].map(entry=>entry.id===id?{...entry,level:entry.level+1}:entry)};
}

export function equipWeapon(profile:Profile,characterId:string,weaponId:string|null):Profile{
 const character=characters.find(entry=>entry.id===characterId);
 if(!character||!profile.characters.some(entry=>entry.id===characterId))throw new Error('尚未拥有该角色');
 const equipment=profile.equipment.filter(entry=>entry.characterId!==characterId);
 if(weaponId===null)return {...profile,equipment};
 const weapon=weapons.find(entry=>entry.id===weaponId);
 if(!weapon||!profile.weapons.some(entry=>entry.id===weaponId))throw new Error('尚未拥有该武器');
 if(weapon.weapon!==character.weapon)throw new Error('武器类型与角色不匹配');
 if(equipment.some(entry=>entry.weaponId===weaponId))throw new Error('武器已被其他角色装备，请先卸下');
 return {...profile,equipment:[...equipment,{characterId,weaponId}]};
}

export function exchangeFate(profile:Profile):Profile{
 if(profile.primogems<wishRules.cost)throw new Error('原石不足');
 return {...profile,primogems:profile.primogems-wishRules.cost,intertwinedFates:profile.intertwinedFates+1};
}

function tierProbability(base:number,count:number,softStart:number,softStep:number,hardPity:number){
 return count+1>=hardPity?1:Math.min(1,base+Math.max(0,count+2-softStart)*softStep);
}

export function performWish(profile:Profile,banner:'character'|'weapon',random:()=>number=Math.random):WishResult{
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
 const key=reward.kind==='character'?'characters':'weapons';
 const owned=profile[key];
 const duplicate=owned.some(entry=>entry.id===reward.id);
 return {reward,duplicate,profile:{
  ...profile,intertwinedFates:profile.intertwinedFates-1,
  [key]:duplicate?owned.map(entry=>entry.id===reward.id?{...entry,copies:entry.copies+1}:entry)
    :[...owned,{id:reward.id,level:1,copies:1}],
  [fiveKey]:rarity===5?0:profile[fiveKey]+1,
  [fourKey]:rarity===4?0:Math.min(rules.fourHardPity-1,profile[fourKey]+1)
 }};
}

type Trial={readonly kind:'stage';readonly stageId:string}|{readonly kind:'adventure';readonly settings:AdventureSettings};

export function startTrial(save:LocalSave,trial:Trial):RunStart{
 const character=characters.find(entry=>entry.id===save.selected);
 const owned=save.profile.characters.find(entry=>entry.id===save.selected);
 if(!character||!owned)throw new Error('请选择已拥有的角色');
 const stage=trial.kind==='stage'?stages.find(entry=>entry.id===trial.stageId):null;
 if(stage===undefined)throw new Error('关卡不存在');
 const settings=trial.kind==='adventure'?trial.settings:null;
 if(settings?.mode==='timed'&&(!Number.isInteger(settings.durationSeconds)||settings.durationSeconds<60||settings.durationSeconds>3600)){
  throw new Error('限时冒险的时长需为 60 至 3600 秒');
 }
 const equipped=save.profile.equipment.find(entry=>entry.characterId===character.id);
 const definition=equipped?weapons.find(entry=>entry.id===equipped.weaponId&&entry.weapon===character.weapon):undefined;
 const weapon=definition?save.profile.weapons.find(entry=>entry.id===definition.id):undefined;
 return {
  runId:crypto.randomUUID(),seed:Math.floor(Math.random()*0x7fffffff),level:owned.level,stage,
  adventure:settings?{settings,rules:adventureRules}:null,character,
  equippedWeapon:definition&&weapon?{definition,level:weapon.level}:null
 };
}

export function trialReward(run:RunStart,kills:number,ticks:number){
 if(run.stage)return kills===run.stage.enemies
  ?{mora:run.stage.mora,primogems:run.stage.primogems}:{mora:0,primogems:0};
 return run.adventure?adventureReward(run.adventure,kills,ticks):{mora:0,primogems:0};
}

export function settleTrial(save:LocalSave,run:RunStart,kills:number,ticks:number):LocalSave{
 if(!Number.isSafeInteger(kills)||kills<0||!Number.isSafeInteger(ticks)||ticks<0||
  (run.stage&&(kills>run.stage.enemies||ticks===0))||
  (run.adventure?.settings.mode==='timed'&&ticks>run.adventure.settings.durationSeconds*20)){
  throw new Error('本局战果无效');
 }
 const existing=save.results.find(result=>result.runId===run.runId);
 if(existing){
  if(existing.kills!==kills||existing.ticks!==ticks)throw new Error('该试炼已结算');
  return save;
 }
 const reward=trialReward(run,kills,ticks);
 const cleared=run.stage&&kills===run.stage.enemies&&!save.clearedStages.includes(run.stage.id);
 return {...save,
  profile:{...save.profile,mora:save.profile.mora+reward.mora,primogems:save.profile.primogems+reward.primogems,runs:save.profile.runs+1},
  clearedStages:cleared&&run.stage?[...save.clearedStages,run.stage.id]:save.clearedStages,
  results:[...save.results,{runId:run.runId,kills,ticks}]
 };
}
