import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const fixture=new URL('../.local/verification/database-fixture.json',import.meta.url);
const call=async(name,body={})=>{
 const response=await fetch('http://127.0.0.1:8085/api/'+name,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await response.json();
 if(!response.ok)throw new Error(data.error);
 return data;
};
const health=await fetch('http://127.0.0.1:8085/api/health').then(r=>r.json());
assert.equal(health.database,'ready');
assert.ok(health.appliedMigrations>=5);
const action=process.argv[2]??'prepare';
if(action==='prepare'){
 const guest=await call('createguest',{nickname:'数据库持久化验收'});
 const auth={userToken:guest.token};
 const wishRequest={...auth,requestId:randomUUID()};
 const wishResult=await call('performwish',wishRequest);
 const weaponWish=await call('performweaponwish',{...auth,requestId:randomUUID()});
 await call('levelupcharacter',{...auth,characterId:'amber',requestId:randomUUID()});
 await call('levelupweapon',{...auth,weaponId:weaponWish.reward.id,requestId:randomUUID()});
 const beforeRun=await call('getprofile',auth);
 assert.equal(beforeRun.primogems,1600);
 assert.equal(beforeRun.intertwinedFates,8);
 assert.equal(beforeRun.mora,4200);
 const runRequest={...auth,characterId:'amber',requestId:randomUUID()};
 const run=await call('startrun',runRequest);
 await call('abandonrun',{...auth,runId:run.runId});
 const expected=await call('getprofile',auth);
 const migrations=health.appliedMigrations;
 await fs.mkdir(new URL('.',fixture),{recursive:true});
 await fs.writeFile(fixture,JSON.stringify({auth,expected,wishRequest,wishResult,runId:run.runId,runRequest,run,migrations},null,2));
 console.log('PASS: 已保存测试档案、角色/武器培养、余额、抽取回执和零进度撤离对局；重启后执行 check');
}else if(action==='check'){
 const saved=JSON.parse(await fs.readFile(fixture,'utf8'));
 assert.deepEqual(await call('getprofile',saved.auth),saved.expected);
 assert.deepEqual(await call('startrun',saved.runRequest),saved.run);
 assert.deepEqual(await call('performwish',saved.wishRequest),saved.wishResult);
 assert.deepEqual(await call('getprofile',saved.auth),saved.expected);
 assert.equal(health.appliedMigrations,saved.migrations);
 await assert.rejects(()=>call('submitrunresult',{...saved.auth,runId:saved.runId,kills:0,ticks:1}));
 console.log('PASS: 重启后资产、角色/武器、抽取回执和撤离结算与冒险快照保持，重复抽取不再次扣费，迁移不重复执行');
}else{
 throw new Error('支持 prepare 或 check');
}
