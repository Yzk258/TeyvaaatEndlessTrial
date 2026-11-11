import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from '../frontend/node_modules/vite/dist/node/index.js';

async function loadModule(name){
 const root=fileURLToPath(new URL('../frontend/',import.meta.url));
 const entry=fileURLToPath(new URL('../frontend/src/game/local/'+name+'.ts',import.meta.url));
 const [bundle]=await build({root,configFile:false,logLevel:'silent',
  build:{write:false,lib:{entry,formats:['es'],fileName:name}}});
 const code=bundle.output.find(item=>item.type==='chunk').code;
 return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}

const {createSave,readSaveData}=await loadModule('LocalSave');
const {startTrial,settleTrial,trialReward,exchangeFate,levelUp,equipWeapon,performWish,performWishes,selectCharacter}=await loadModule('progression');
const initial=createSave('旅行者');
const another=createSave('另一份存档');
assert.notEqual(initial.id,another.id);
assert.equal(initial.selected,'amber');
assert.throws(()=>readSaveData({...initial,version:2}),/版本/);
assert.throws(()=>readSaveData({...initial,profile:{...initial.profile,mora:-1}}),/格式/);
assert.equal(readSaveData({...initial,selected:'unavailable'}).selected,'amber');
assert.throws(()=>selectCharacter(initial,'unavailable'),/尚未拥有/);

const trial=startTrial(initial,{kind:'stage',stageId:'forest'});
const cleared=settleTrial(initial,trial,trial.stage.enemies,60);
assert.equal(cleared.profile.mora,initial.profile.mora+trial.stage.mora);
assert.equal(cleared.profile.primogems,initial.profile.primogems+trial.stage.primogems);
assert.deepEqual(cleared.clearedStages,['forest']);
assert.equal(settleTrial(cleared,trial,trial.stage.enemies,60),cleared);
assert.throws(()=>settleTrial(cleared,trial,trial.stage.enemies,61),/已结算/);
assert.equal(settleTrial(initial,trial,1,20).profile.mora,initial.profile.mora);
const endless=startTrial(cleared,{kind:'adventure',settings:{mode:'endless',durationSeconds:null}});
const withdrawn=settleTrial(cleared,endless,3,600);
assert.equal(withdrawn.profile.mora-cleared.profile.mora,trialReward(endless,3,600).mora);
assert.deepEqual(readSaveData(JSON.parse(JSON.stringify(withdrawn))),withdrawn);
assert.equal(another.profile.runs,0);

const upgraded=levelUp(withdrawn.profile,'character','amber');
assert.equal(upgraded.characters[0].level,2);
assert.ok(upgraded.mora<withdrawn.profile.mora);
assert.throws(()=>levelUp({...upgraded,mora:0},'character','amber'),/摩拉不足/);
const exchange=exchangeFate(upgraded);
assert.equal(exchange.primogems,upgraded.primogems-160);
assert.equal(exchange.intertwinedFates,upgraded.intertwinedFates+1);
const characterWish=performWish({...exchange,pity:89},'character',()=>0.99);
assert.equal(characterWish.reward.kind,'character');
assert.equal(characterWish.reward.rarity,5);
assert.equal(characterWish.profile.pity,0);
assert.equal(characterWish.profile.weaponPity,0);
const weaponWish=performWish({...characterWish.profile,weaponPity:79},'weapon',()=>0.99);
assert.equal(weaponWish.reward.kind,'weapon');
assert.equal(weaponWish.reward.rarity,5);
assert.equal(weaponWish.profile.weaponPity,0);
assert.equal(weaponWish.profile.intertwinedFates,exchange.intertwinedFates-2);
assert.throws(()=>performWish({...exchange,intertwinedFates:0},'weapon'),/纠缠之缘不足/);

for(const banner of ['character','weapon']){
 const before={...exchange,intertwinedFates:10,pity:89,weaponPity:79};
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
 if(banner==='weapon')assert(batch.pulls.every(({reward})=>reward.kind==='weapon'));
}
assert.throws(()=>performWishes({...exchange,intertwinedFates:9},'character',10,()=>assert.fail('余额不足时不应抽取')),/需要 10 个/);
const bow={id:'raven-bow',level:1,copies:1};
const equipped=equipWeapon({...initial.profile,weapons:[bow]},'amber',bow.id);
const loadout=startTrial({...initial,profile:equipped},{kind:'stage',stageId:'forest'});
assert.equal(loadout.equippedWeapon.definition.id,bow.id);
assert.deepEqual(equipWeapon(equipped,'amber',null).equipment,[]);
console.log('PASS: 存档格式、角色强化、装备、兑换、两池保底、撤离奖励及结算防重');
