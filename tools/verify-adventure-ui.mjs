import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {randomInt} from 'node:crypto';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const root=new URL('../',import.meta.url);
await fs.mkdir(new URL('.local/',root),{recursive:true});
const profile=await fs.mkdtemp(new URL('.local/adventure-ui-',root));
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
 '--headless=new','--disable-gpu','--no-first-run','--disable-background-networking','--hide-scrollbars',
 '--window-size=1440,1100','--remote-debugging-port=0','--user-data-dir='+profile
],{windowsHide:true,stdio:'ignore'});
const activePort=async(attempt=0)=>fs.readFile(profile+'/DevToolsActivePort','utf8').catch(async error=>{if(browser.exitCode!==null)throw Error('浏览器启动失败，退出码 '+browser.exitCode);if(attempt>100)throw error;await delay(100);return activePort(attempt+1);});
const [port,path]=(await activePort()).trim().split(/\r?\n/);
const ws=new WebSocket('ws://127.0.0.1:'+port+path);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
 const id=randomInt(1,2147483647);
 const receive=event=>{const data=JSON.parse(event.data);if(data.id!==id)return;ws.removeEventListener('message',receive);if(data.error)reject(Error(data.error.message));else resolve(data.result);};
 ws.addEventListener('message',receive);ws.send(JSON.stringify({id,method,params,sessionId}));
});
const {targetId}=await command('Target.createTarget',{url:'about:blank'});
const {sessionId}=await command('Target.attachToTarget',{targetId,flatten:true});
const evaluate=async expression=>{const value=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(value.exceptionDetails)throw Error(value.exceptionDetails.text);return value.result.value;};
const waitFor=async(expression,deadline=Date.now()+20000)=>{if(await evaluate(expression))return;if(Date.now()>deadline)throw Error('UI wait timed out: '+expression);await delay(150);return waitFor(expression,deadline);};
const click=async text=>{const success=await evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)}&&!b.disabled);if(!button)return false;button.click();return true;})()`);assert.ok(success,'Button missing: '+text);};
const screenshot=async name=>{const {data}=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await fs.writeFile(profile+'/'+name+'.png',Buffer.from(data,'base64'));};
const verify=async()=>{
await command('Page.enable',{},sessionId);
await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
const gameUrl=new URL('#/camp',process.env.TEYVAT_VERIFY_GAME_URL??'http://127.0.0.1:5175/').href;
const offline=process.env.TEYVAT_VERIFY_OFFLINE==='1';
await command('Page.navigate',{url:gameUrl},sessionId);
await waitFor(`[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='点击进入'&&!b.disabled)`);
if(offline){
 await click('下载离线资源');
 await waitFor(`document.body.textContent.includes('离线资源已就绪')`,Date.now()+120000);
 await command('Network.enable',{},sessionId);
 await command('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0},sessionId);
 await command('Page.reload',{},sessionId);
 await waitFor(`[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='点击进入'&&!b.disabled)`);
}
await click('点击进入');
await waitFor(`[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='新游戏'&&!b.disabled)`);
await click('新游戏');
await waitFor(`document.body.textContent.includes('选择无尽难度')`);
assert.equal(await evaluate(`document.body.textContent.includes('限时冒险')`),false);
await screenshot('adventure-difficulties');
for(const [id,label,health] of [['normal','普通','1.00'],['hard','困难','1.35'],['extreme','极限','1.70']]){
 await evaluate(`document.querySelector('input[name="adventure-difficulty"][value="${id}"]').click()`);
 await click('开始无尽冒险');
 await waitFor(`document.body.textContent.includes(${JSON.stringify('低语森林 · 无尽 · '+label)})`);
 assert.ok(await evaluate(`document.body.textContent.includes(${JSON.stringify('生命 ×'+health)})`));
 await click('退出');
 await waitFor(`document.body.textContent.includes('现在撤离并结算？')`);
 await click('撤离并领取奖励');
 await waitFor(`document.body.textContent.includes('本次冒险已结算：')`);
 await click('知道了');
 await waitFor(`document.querySelector('input[name="adventure-difficulty"]:checked')?.value===${JSON.stringify(id)}`);
}
await evaluate(`location.hash='#/stages'`);
await waitFor(`document.body.textContent.includes('摩拉关卡')`);
assert.ok(await evaluate(`document.body.textContent.includes('摩拉 +300')`));
await click('原石关卡');
await waitFor(`document.body.textContent.includes('原石 +40')`);
await screenshot('stage-primogems');
await click('开始挑战');
await waitFor(`document.body.textContent.includes('低语森林 · 简单')`);
assert.ok(await evaluate(`document.body.textContent.includes('击败 0 / 15')`));
await click('退出');
await click('确认放弃');
await waitFor(`document.body.textContent.includes('已放弃本次试炼')`);
await click('知道了');
assert.ok(await evaluate(`document.body.textContent.includes('原石 +40')`));
await command('Page.reload',{},sessionId);
await waitFor(`[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='点击进入'&&!b.disabled)`);
await click('点击进入');
const savedButton='document.querySelector("[aria-label=\\"继续游戏\\"] button")';
await waitFor('Boolean('+savedButton+')');
assert.ok(await evaluate(savedButton+".textContent.includes('3 次试炼')"));
await evaluate(savedButton+'.click()');
await waitFor(`document.body.textContent.includes('选择无尽难度')`);
console.log('PASS: 浏览器新建存档、无尽难度、关卡分类、撤离结算和刷新后继续'+(offline?'，全程离线':''));
};
await verify().finally(async()=>{await command('Browser.close').catch(()=>browser.kill());ws.close();browser.unref();});
