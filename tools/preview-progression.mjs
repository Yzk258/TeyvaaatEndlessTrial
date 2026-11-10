import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await Promise.all([
 server.ssrLoadModule('/src/pages/CharacterPage/components/CharacterRoster.tsx'),
 server.ssrLoadModule('/src/pages/BattlePage/components/BattleScene.tsx'),
 server.ssrLoadModule('/src/pages/BattlePage/components/UpgradeOptions.tsx'),
 server.ssrLoadModule('/src/game/functions/stepBattle.ts'),
 server.ssrLoadModule('/src/game/functions/battleLoot.ts'),
 server.ssrLoadModule('/src/game/functions/battleUpgrades.ts'),
 fs.readFile(new URL('../shared/characters.json',import.meta.url),'utf8'),
 fs.readdir(new URL('../frontend/dist/assets/',import.meta.url)),
 server.ssrLoadModule('/src/pages/WeaponsPage/index.tsx'),
 fs.readFile(new URL('../shared/weapons.json',import.meta.url),'utf8')
]).then(async([{CharacterRoster},{BattleScene},{UpgradeOptions},{initialBattle},{createEnemyLoot,stepLoot},{rollUpgradeChoices},json,files,{WeaponsPage},weaponJson])=>{
 const characters=JSON.parse(json),cssFile=files.find(name=>name.endsWith('.css'));
 const css=await fs.readFile(new URL('../frontend/dist/assets/'+cssFile,import.meta.url),'utf8');
 const render=(component,props)=>renderToStaticMarkup(createElement(component,props)).replaceAll('href="/characters/','href="../../frontend/public/characters/').replaceAll('src="/characters/','src="../../frontend/public/characters/');
 const html=(title,body)=>'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>'+css+'body{background:#101e25;color:#e7e1d7;font-family:system-ui}.page{max-width:1360px;margin:0 auto;padding:28px}.page>h1{font-size:28px;margin-bottom:10px}.page>p{font-size:13px;color:#a6b5b8;margin-bottom:24px}.frames{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.frames article{background:#21382d;border:1px solid #ffffff20;border-radius:12px;overflow:hidden}.frames h2{font-size:15px;padding:12px}.scene{position:relative;height:280px}.options{position:relative;height:410px;margin-top:20px;overflow:hidden;border-radius:16px}</style><main class="page"><h1>'+title+'</h1>'+body+'</main></html>';
 const profile={primogems:1600,mora:5000,intertwinedFates:10,characters:characters.map(c=>({id:c.id,level:1,copies:0})),weapons:[],equipment:[],pity:0,weaponPity:0,fourStarPity:0,weaponFourStarPity:0,runs:0};
 const roster=render(CharacterRoster,{profile,selected:'amber',onSelect:()=>{},onLevel:()=>{},pending:false});
 if(roster.match(/aria-label="安柏半身立绘"[^>]*data-portrait="gallery-pixel"/g)?.length!==2)throw Error('Amber gallery portrait missing from selection or character list');
 await fs.writeFile(new URL('../docs/assets/character-development-preview.html',import.meta.url),html('角色培养 · 选中角色与强化', '<p>实际页面组件预览。上方左侧半身照、右侧强化；下方显示首屏角色像素立绘。</p>'+roster));
 const enemies=[{id:901,x:560,y:270,hp:0,kind:'slime'},{id:902,x:600,y:285,hp:0,kind:'hilichurl'},{id:903,x:640,y:245,hp:0,kind:'boss'}];
 const loot=createEnemyLoot(enemies,0,null,null),base=initialBattle(42),character=characters.find(c=>c.id==='amber');
 const sample=(steps)=>Array.from({length:steps}).reduce(s=>{const next=stepLoot(s.particles,450,270);return {particles:next.particles,experience:s.experience+next.experience,mora:s.mora+next.mora};},{particles:loot,experience:0,mora:0});
 const frames=[{title:'掉落散开',ticks:4},{title:'粒子飞向角色',ticks:11},{title:'吸收并更新计数',ticks:19}].map(frame=>{
  const result=sample(frame.ticks),state={...base,tick:frame.ticks,loot:result.particles,collectedMora:result.mora};
  return '<article><h2>'+frame.title+' · 经验 '+result.experience+' / 摩拉 '+result.mora+'</h2><div class="scene">'+render(BattleScene,{state,character,bounded:true,reducedMotion:false}).replace('viewBox="0 0 900 540"','viewBox="385 180 330 220"')+'</div></article>';
 }).join('');
 const offerState={...base,hp:65,level:3,phase:'upgrade',pendingUpgrades:1},offer=rollUpgradeChoices(offerState);
 const options=render(UpgradeOptions,{state:{...offerState,upgradeChoices:offer.choices},onChoose:()=>{}});
 await fs.writeFile(new URL('../docs/assets/progression-loot-preview.html',import.meta.url),html('经验与摩拉粒子 · 随机强化','<p>使用实际粒子物理与页面组件渲染的关键帧；游戏中按逻辑时间连续播放。</p><div class="frames">'+frames+'</div><div class="options">'+options+'</div>'));
 const weaponCatalog=JSON.parse(weaponJson);
 const weaponProfile={...profile,weapons:[{id:'skyward-blade',level:5,copies:0},...weaponCatalog.filter(w=>w.id!=='skyward-blade').map(w=>({id:w.id,level:1,copies:0}))],equipment:[{characterId:'kaeya',weaponId:'skyward-blade'}]};
 const renderWeapons=profile=>render(WeaponsPage,{profile,selected:'kaeya',pending:false,onLevelWeapon:()=>{},onEquipWeapon:()=>{}}).replaceAll('src="/weapons/','src="../../frontend/public/weapons/').replaceAll('href="/weapons/','href="../../frontend/public/weapons/');
 const weaponMarkup=renderWeapons(weaponProfile);
 const weaponEmpty=renderWeapons(profile);
 if(!weaponMarkup.includes('武器强化')||!weaponMarkup.includes('已装备')||!weaponEmpty.includes('尚未拥有武器'))throw Error('Weapon states failed to render');
 await fs.writeFile(new URL('../docs/assets/weapon-development-preview.html',import.meta.url),html('武器培养 · 选中武器与强化','<p>实际页面组件预览：上方左侧选中武器，右侧强化与装备，下方为武器列表。</p>'+weaponMarkup));
 await fs.writeFile(new URL('../docs/assets/weapon-development-empty-preview.html',import.meta.url),html('武器培养 · 尚未获得武器',weaponEmpty));
 console.log('PASS: Character, loot and upgrade previews; weapon equipped/empty states rendered');
}).finally(()=>server.close());

