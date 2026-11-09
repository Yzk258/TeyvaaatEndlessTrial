import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const call=async(name,body={})=>{
 const response=await fetch('http://127.0.0.1:8085/api/'+name,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await response.json();
 if(!response.ok)throw new Error(data.error);
 return data;
};
const guest=await call('createguest',{nickname:'暂停退出验收'});
const auth={userToken:guest.token};
const start=stageId=>call('startrun',{...auth,characterId:'amber',requestId:randomUUID(),stageId});
const run=await start('forest');
const stranger=await call('createguest',{nickname:'身份隔离验收'});
await assert.rejects(()=>call('abandonrun',{userToken:stranger.token,runId:run.runId}));
await Promise.all([call('abandonrun',{...auth,runId:run.runId}),call('abandonrun',{...auth,runId:run.runId})]);
await assert.rejects(()=>call('submitrunresult',{...auth,runId:run.runId,kills:0,ticks:1}));
const profile=await call('getprofile',auth);
assert.equal(profile.primogems,1600);
assert.equal(profile.mora,5000);
assert.equal(profile.runs,0);
const next=await start(null);
const race=await Promise.allSettled([
 call('abandonrun',{...auth,runId:next.runId}),
 call('submitrunresult',{...auth,runId:next.runId,kills:0,ticks:1})
]);
assert.equal(race.filter(r=>r.status==='fulfilled').length,1);
const adventure={mode:'endless',durationSeconds:null};
await assert.rejects(()=>call('startrun',{...auth,characterId:'amber',requestId:randomUUID(),stageId:'forest',adventure}));
await assert.rejects(()=>call('startrun',{...auth,characterId:'amber',requestId:randomUUID(),adventure:{mode:'unknown',durationSeconds:null}}));
const retreat=await call('startrun',{...auth,characterId:'amber',requestId:randomUUID(),adventure});
assert.deepEqual(retreat.adventure.settings,adventure);
const progress={...auth,runId:retreat.runId,kills:1,ticks:12};
await Promise.all([call('abandonrun',progress),call('abandonrun',progress)]);
const rewarded=await call('getprofile',auth);
assert.equal(rewarded.mora,5010);
assert.equal(rewarded.primogems,1600);
await assert.rejects(()=>call('abandonrun',{...progress,kills:2}));
console.log('PASS: 身份隔离、关卡放弃无奖励、冒险撤离按击杀领奖、重复结算幂等、模式输入校验、退出与结算竞争仅一方成功');
