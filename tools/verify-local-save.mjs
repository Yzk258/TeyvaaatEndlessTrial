import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from '../frontend/node_modules/vite/dist/node/index.js';

async function loadModule(name,directory='game/local'){
 const root=fileURLToPath(new URL('../frontend/',import.meta.url));
 const entry=fileURLToPath(new URL('../frontend/src/'+directory+'/'+name+'.ts',import.meta.url));
 const [bundle]=await build({root,configFile:false,logLevel:'silent',
  build:{write:false,lib:{entry,formats:['es'],fileName:name}}});
 const code=bundle.output.find(item=>item.type==='chunk').code;
 return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}

const {createSave,readSaveData}=await loadModule('LocalSave');
const {startTrial,settleTrial,trialRewards,levelUp,equipWeapon,performWish,performWishes,requestWishes,selectCharacter,setCharacterFavorite}=await loadModule('progression');
const {characterListEntries}=await loadModule('CharacterList','objects');
const {equipArtifact,levelUpArtifact}=await loadModule('artifactProgression');
const {equippedCharacterStats}=await loadModule('artifactStats','game/functions');
const initial=createSave('旅行者');
const another=createSave('另一份存档');
assert.notEqual(initial.id,another.id);
assert.equal(initial.selected,'amber');
assert.equal(initial.version,2);
assert.deepEqual(readSaveData({...initial,checkIns:7}),initial);
assert.throws(()=>readSaveData({...initial,version:3}),/版本/);
assert.throws(()=>readSaveData({...initial,profile:{...initial.profile,mora:-1}}),/格式/);
assert.equal(readSaveData({...initial,selected:'unavailable'}).selected,'amber');
assert.throws(()=>selectCharacter(initial,'unavailable'),/尚未拥有/);

const {artifacts:starterArtifacts,artifactEquipment,...preArtifactProfile}=initial.profile;
assert.equal(starterArtifacts.length,5);
assert.deepEqual(readSaveData({...initial,profile:preArtifactProfile}).profile,initial.profile);
const [flower,plume,sands,goblet,circlet]=starterArtifacts;
assert.throws(()=>equipArtifact(initial.profile,'amber','plume',flower.id),/部位不匹配/);
assert.throws(()=>equipArtifact(initial.profile,'amber','flower','missing'),/尚未拥有/);
const starter=initial.profile;
let artifactProfile=starter;
const stageRequest={kind:'stage',stageId:'forest'};
const artifactStats=profile=>{
 const run=startTrial({...initial,profile},stageRequest);
 return equippedCharacterStats(run.character,run.level,run.equippedWeapon,run.equippedArtifacts);
};
assert.equal(artifactStats(artifactProfile).attack,2);
artifactProfile=equipArtifact(artifactProfile,'amber','flower',flower.id);
assert.equal(artifactStats(artifactProfile).maxHp,110);
assert.equal(artifactStats(artifactProfile).attack,2);
artifactProfile=equipArtifact(artifactProfile,'amber','plume',plume.id);
assert.equal(artifactStats(artifactProfile).attack,3.45);
assert.equal(artifactStats(artifactProfile).healOnKillPercent,0);
artifactProfile=equipArtifact(artifactProfile,'amber','sands',sands.id);
artifactProfile=equipArtifact(artifactProfile,'amber','goblet',goblet.id);
assert.equal(artifactStats(artifactProfile).healOnKillPercent,3);
assert.equal(artifactStats(artifactProfile).attackRange,304);
artifactProfile=equipArtifact(artifactProfile,'amber','circlet',circlet.id);
assert.equal(artifactStats(artifactProfile).healOnKillPercent,3);
assert.equal(artifactStats(artifactProfile).maxHp,114);
assert.equal(startTrial({...initial,profile:artifactProfile},stageRequest).equippedArtifacts.length,5);
const withSecondCharacter={...artifactProfile,characters:[...starter.characters,{id:'kaeya',level:1,copies:1}]};
assert.throws(()=>equipArtifact(withSecondCharacter,'kaeya','flower',flower.id),/已被其他角色装备/);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify({...initial,profile:artifactProfile}))).profile,artifactProfile);
const secondFlower={...flower,id:'another-flower'};
const withSecondFlower={...artifactProfile,artifacts:[...starterArtifacts,secondFlower]};
assert.throws(()=>readSaveData({...initial,profile:{...withSecondFlower,artifactEquipment:[...artifactProfile.artifactEquipment,{characterId:'amber',artifactInstanceId:secondFlower.id}]}}),/格式/);
const replaced=equipArtifact(withSecondFlower,'amber','flower',secondFlower.id);
assert.equal(replaced.artifactEquipment.length,5);
assert(!replaced.artifactEquipment.some(entry=>entry.artifactInstanceId===flower.id));
const unequipped=equipArtifact(equipArtifact(artifactProfile,'amber','flower',null),'amber','plume',null);
assert.equal(artifactStats(unequipped).healOnKillPercent,0);
assert.throws(()=>levelUpArtifact({...artifactProfile,mora:199},flower.id),/摩拉不足/);
for(let level=0;level<4;level++)artifactProfile=levelUpArtifact(artifactProfile,flower.id);
assert.equal(artifactProfile.mora,starter.mora-800);
assert.equal(artifactStats(artifactProfile).maxHp,127);
assert.throws(()=>levelUpArtifact(artifactProfile,flower.id),/等级上限/);
console.log('PASS: 初学者套装迁移、五部位、装备占用、同部位更换、主词条强化和两件/四件效果');

const {favoriteCharacters:initialFavorites,...oldSave}=initial;
assert.deepEqual(readSaveData(oldSave).favoriteCharacters,initialFavorites);
const withOwned={...initial,profile:{...initial.profile,characters:[
 ...initial.profile.characters,{id:'hu-tao',level:1,copies:1},{id:'furina',level:1,copies:1}
]}};
const savedFavorites=setCharacterFavorite(setCharacterFavorite(withOwned,'hu-tao',true),'furina',true);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify(savedFavorites))).favoriteCharacters,['furina','hu-tao']);
assert.equal(savedFavorites.selected,initial.selected);
assert.equal(setCharacterFavorite(savedFavorites,'furina',true),savedFavorites);
assert.throws(()=>setCharacterFavorite(withOwned,'lisa',true),/尚未拥有/);
const ranked=characterListEntries(savedFavorites.profile.characters,savedFavorites.favoriteCharacters);
assert.deepEqual(ranked.slice(0,3).map(entry=>entry.definition.id),['furina','hu-tao','amber']);
assert(ranked.slice(3).every(entry=>!entry.owned&&!entry.favorite));
const removed=setCharacterFavorite(savedFavorites,'hu-tao',false);
assert.deepEqual(characterListEntries(removed.profile.characters,removed.favoriteCharacters).slice(0,3).map(entry=>entry.definition.id),['furina','amber','hu-tao']);

const trial=startTrial(initial,{kind:'stage',stageId:'forest'});
assert.equal(trial.map.layout,'arena');
assert.equal(trial.stageDifficulty.level,20);
const highStage=startTrial(initial,{kind:'stage',stageId:'forest',difficulty:'level100'});
assert.equal(highStage.stageDifficulty.healthMultiplier,41.53);
assert.equal(highStage.stageDifficulty.eliteHealthMultiplier,65.16);
assert.deepEqual(highStage.stage.rewards,trial.stage.rewards);
const cleared=settleTrial(initial,trial,trial.stage.enemies,60);
assert.equal(cleared.profile.mora,initial.profile.mora+300);
assert.equal(cleared.profile.primogems,initial.profile.primogems);
assert.deepEqual(cleared.clearedStages,['forest']);
assert.equal(settleTrial(cleared,trial,trial.stage.enemies,60),cleared);
assert.throws(()=>settleTrial(cleared,trial,trial.stage.enemies,61),/已结算/);
assert.equal(settleTrial(initial,trial,1,20).profile.mora,initial.profile.mora);
const gemTrial=startTrial(cleared,{kind:'stage',stageId:'forest-primogems'});
assert.deepEqual(gemTrial.map,trial.map);
assert.equal(gemTrial.stage.category,'primogems');
assert.deepEqual(trialRewards(gemTrial,gemTrial.stage.enemies-1,60),[]);
const gemClear=settleTrial(cleared,gemTrial,gemTrial.stage.enemies,60);
assert.equal(gemClear.profile.primogems,cleared.profile.primogems+40);
assert.equal(gemClear.profile.mora,cleared.profile.mora);
assert.deepEqual(gemClear.clearedStages,['forest','forest-primogems']);
assert.equal(settleTrial(gemClear,gemTrial,gemTrial.stage.enemies,60),gemClear);
const endless=startTrial(cleared,{kind:'adventure',settings:{difficulty:'level40'}});
assert.equal(endless.map.layout,'endless');
assert.equal(endless.adventure.difficulty.healthMultiplier,3.04);
assert.equal(endless.adventure.difficulty.eliteHealthMultiplier,3.34);
assert.throws(()=>startTrial(cleared,{kind:'adventure',settings:{difficulty:'missing'}}),/有效的战斗难度/);
assert.throws(()=>startTrial(cleared,{kind:'stage',stageId:'forest',difficulty:'missing'}),/有效的战斗难度/);
const withdrawn=settleTrial(cleared,endless,3,600);
const drops=['beginner-flower','beginner-flower'];
const rewarded=settleTrial(cleared,endless,80,11400,drops);
const newArtifacts=rewarded.profile.artifacts.slice(cleared.profile.artifacts.length);
assert.deepEqual(newArtifacts.map(item=>[item.artifactId,item.level]),drops.map(id=>[id,0]));
assert.equal(new Set(newArtifacts.map(item=>item.id)).size,2);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify(rewarded))),rewarded);
assert.equal(settleTrial(rewarded,endless,80,11400,drops),rewarded);
assert.throws(()=>settleTrial(rewarded,endless,80,11400,['beginner-sands']),/已结算/);
assert.throws(()=>settleTrial(cleared,endless,80,11400,['missing']),/战果无效/);
assert.throws(()=>settleTrial(cleared,trial,trial.stage.enemies,60,drops),/战果无效/);
assert.deepEqual(trialRewards(endless,3,600),[{kind:'currency',currency:'mora',amount:70},{kind:'currency',currency:'primogems',amount:3}]);
assert.equal(withdrawn.profile.mora-cleared.profile.mora,70);
assert.equal(withdrawn.profile.primogems-cleared.profile.primogems,3);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify(withdrawn))),withdrawn);
assert.equal(another.profile.runs,0);

const upgraded=levelUp(withdrawn.profile,'character','amber');
assert.equal(upgraded.characters[0].level,2);
assert.ok(upgraded.mora<withdrawn.profile.mora);
assert.throws(()=>levelUp({...upgraded,mora:0},'character','amber'),/摩拉不足/);
const characterWish=performWish({...upgraded,pity:89},'character',()=>0.99);
assert.equal(characterWish.reward.kind,'character');
assert.equal(characterWish.reward.rarity,5);
assert.equal(characterWish.profile.pity,0);
assert.equal(characterWish.profile.weaponPity,0);
const weaponWish=performWish({...characterWish.profile,weaponPity:79},'weapon',()=>0.99);
assert.equal(weaponWish.reward.kind,'weapon');
assert.equal(weaponWish.reward.rarity,5);
assert.equal(weaponWish.profile.weaponPity,0);
assert.equal(weaponWish.profile.intertwinedFates,upgraded.intertwinedFates-2);
assert.throws(()=>performWish({...upgraded,intertwinedFates:0},'weapon'),/纠缠之缘不足/);

for(const banner of ['character','weapon']){
 const before={...upgraded,intertwinedFates:10,pity:89,weaponPity:79};
 const batch=performWishes(before,banner,10,()=>0.99);
 let expected=before;
 const expectedPulls=[];
 for(let index=0;index<10;index++){
  const {profile,reward,duplicate}=performWish(expected,banner,()=>0.99);
  expected=profile;
  expectedPulls.push({reward,duplicate});
 }
 assert.deepEqual(batch.pulls,expectedPulls);
 assert.deepEqual(batch.profile,expected);
 assert.equal(batch.profile.intertwinedFates,0);
 assert.equal(batch.pulls[0].reward.rarity,5);
 assert(batch.pulls.some(({reward,duplicate})=>reward.rarity===3&&duplicate));
 assert.equal(batch.profile[banner==='character'?'weaponPity':'pity'],before[banner==='character'?'weaponPity':'pity']);
 const weaponPulls=batch.pulls.filter(({reward})=>reward.kind==='weapon');
 const added=batch.profile.weapons.slice(before.weapons.length);
 assert.deepEqual(added.map(entry=>entry.weaponId),weaponPulls.map(({reward})=>reward.id));
 assert.equal(new Set(batch.profile.weapons.map(entry=>entry.id)).size,batch.profile.weapons.length);
 assert(added.every(entry=>entry.level===1));
 if(banner==='weapon')assert(batch.pulls.every(({reward})=>reward.kind==='weapon'));
}
const noRoll=()=>assert.fail('等待兑换时不应抽取');
assert.throws(()=>performWishes({...upgraded,intertwinedFates:9},'character',10,noRoll),/需要 10 个/);
for(const [banner,count,available] of [['character',1,0],['weapon',10,3]]){
 const profile={...upgraded,primogems:1600,intertwinedFates:available};
 const missingFates=count-available;
 const primogemCost=160*missingFates;
 const quote={kind:'exchange',missingFates,primogemCost};
 assert.deepEqual(requestWishes(profile,banner,count,0,noRoll),quote);
 assert.deepEqual(requestWishes(profile,banner,count,primogemCost-1,noRoll),quote);
 assert.deepEqual(requestWishes({...profile,primogems:primogemCost-1},banner,count,primogemCost,noRoll),quote);
 const funded={...profile,intertwinedFates:count,primogems:profile.primogems-primogemCost};
 assert.deepEqual(requestWishes(profile,banner,count,primogemCost,()=>0.99),{kind:'drawn',...performWishes(funded,banner,count,()=>0.99)});
 const sufficient={...profile,intertwinedFates:count+1};
 assert.deepEqual(requestWishes(sufficient,banner,count,0,()=>0.99),{kind:'drawn',...performWishes(sufficient,banner,count,()=>0.99)});
}
const legacy={...initial,version:1,profile:{...initial.profile,
 characters:[...initial.profile.characters,{id:'yelan',level:1,copies:1},{id:'kaeya',level:1,copies:1}],
 weapons:[{id:'raven-bow',level:5,copies:3}],equipment:[{characterId:'amber',weaponId:'raven-bow'}]
}};
const migrated=readSaveData(legacy);
assert.equal(migrated.version,2);
assert.deepEqual(readSaveData(legacy),migrated);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify(migrated))),migrated);
const [first,second,third]=migrated.profile.weapons;
assert.equal(new Set([first.id,second.id,third.id]).size,3);
assert.deepEqual(migrated.profile.weapons.map(item=>item.weaponId),['raven-bow','raven-bow','raven-bow']);
assert.deepEqual(migrated.profile.weapons.map(item=>item.level),[5,1,1]);
assert.deepEqual(migrated.profile.equipment,[{characterId:'amber',weaponInstanceId:first.id}]);
assert.throws(()=>readSaveData({...legacy,profile:{...legacy.profile,weapons:[{id:'raven-bow',level:1,copies:Number.MAX_SAFE_INTEGER}]}}),/数量过大/);
assert.throws(()=>equipWeapon(migrated.profile,'yelan',first.id),/其他角色装备/);
assert.throws(()=>equipWeapon(migrated.profile,'kaeya',second.id),/类型与角色不匹配/);
const equipped=equipWeapon(migrated.profile,'yelan',second.id);
const leveled=levelUp(equipped,'weapon',second.id);
assert.deepEqual(leveled.weapons.map(item=>item.level),[5,2,1]);
assert.equal(leveled.mora,equipped.mora-300);
const amberRun=startTrial({...migrated,profile:leveled},{kind:'stage',stageId:'forest'});
const yelanRun=startTrial({...migrated,selected:'yelan',profile:leveled},{kind:'stage',stageId:'forest'});
assert.equal(amberRun.equippedWeapon.definition.id,'raven-bow');
assert.equal(yelanRun.equippedWeapon.definition.id,'raven-bow');
assert.equal(amberRun.equippedWeapon.level,5);
assert.equal(yelanRun.equippedWeapon.level,2);
assert.deepEqual(equipWeapon(leveled,'amber',null).equipment,[{characterId:'yelan',weaponInstanceId:second.id}]);
assert.throws(()=>readSaveData({...migrated,profile:{...leveled,equipment:[...leveled.equipment,{characterId:'kaeya',weaponInstanceId:first.id}]}}),/格式/);
console.log('PASS: 存档迁移、武器副本、独立强化与装备、兑换、两池保底、撤离奖励及结算防重');
