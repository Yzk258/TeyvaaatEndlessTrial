import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await Promise.all([
 server.ssrLoadModule('/src/pages/BattlePage/components/BattleScene.tsx'),
 server.ssrLoadModule('/src/game/functions/stepBattle.ts'),
 server.ssrLoadModule('/src/game/functions/resolveAttacks.ts'),
 fs.readFile(new URL('../shared/characters.json',import.meta.url),'utf8')
]).then(async([{BattleScene},{initialBattle,stepBattle},{resolveAttacks},json])=>{
 const characters=JSON.parse(json);
 const prepare=(id)=>{
  const character=characters.find(c=>c.id===id);
  const state={...initialBattle(42),targetEnemies:50,attackPattern:character.attackPattern,attackRange:100,attackIntervalTicks:12,power:2,enemies:[{id:801,x:510,y:270,hp:20,kind:'hilichurl'}]};
  return {character,state};
 };
 const attack=(id,age=0)=>{
  const {character,state}=prepare(id);
  const first={...state,...resolveAttacks(state,state.enemies,state.x,state.y,0,12),tick:12};
  return {character,state:Array.from({length:age}).reduce(s=>stepBattle(s,{kind:'tick',keys:[]}),first)};
 };
 const walk=prepare('amber');
 const melee=attack('kaeya',2);
 const arrow=attack('amber',1);
 const burst=attack('lisa',1);
 const {state:deadBase,character:deadCharacter}=prepare('kaeya');
 const killed={...deadBase,power:30};
 const death={...killed,...resolveAttacks(killed,killed.enemies,killed.x,killed.y,0,12),tick:12};
 const frames=[
  {title:'走动 · 脚步与身体起伏',character:walk.character,state:{...walk.state,motion:{moving:true,distance:12}}},
  {title:'走动 · 反向迈步',character:walk.character,state:{...walk.state,facing:Math.PI,motion:{moving:true,distance:39}}},
  {title:'近战 · 剑弧与命中反馈',...melee},
  {title:'远程 · 箭矢与拉弓动作',...arrow},
  {title:'范围 · 雷光与扩散波纹',...burst},
  {title:'击破 · 粒子与伤害数字',character:deadCharacter,state:{...death,enemies:[],hits:death.hits.map(h=>({...h,life:7})),tick:15}}
 ];
 const cards=frames.map(frame=>'<article><h2>'+frame.title+'</h2><div class="scene">'+renderToStaticMarkup(createElement(BattleScene,{...frame,bounded:true,reducedMotion:false})).replace('viewBox="0 0 900 540"','viewBox="365 205 220 145"').replaceAll('href="/characters/pixel/','href="../../frontend/public/characters/pixel/')+'</div></article>').join('');
 const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>战斗动态反馈预览</title><style>body{margin:0;padding:24px;background:#14231f;color:#ece6d9;font-family:system-ui}h1{margin:0 0 8px;font-size:24px;font-weight:500}p{color:#a7b8ab;font-size:13px;margin-bottom:22px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}article{border:1px solid #ffffff20;border-radius:12px;background:#233a2e;overflow:hidden}h2{font-size:16px;font-weight:500;padding:14px 16px;margin:0}.scene{height:360px;background:#263d30}.scene svg{width:100%;height:100%;display:block}</style><h1>战斗动态反馈 · 像素风</h1><p>使用实际战斗组件渲染的关键帧：走动、出手、命中、击破。实际游戏按逻辑时间连续播放。</p><div class="grid">'+cards+'</div></html>';
 await fs.writeFile(new URL('../docs/assets/battle-feedback-preview.html',import.meta.url),html);
 console.log('Saved docs/assets/battle-feedback-preview.html');
}).finally(()=>server.close());
