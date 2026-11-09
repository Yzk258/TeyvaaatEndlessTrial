import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await Promise.all([server.ssrLoadModule('/src/pages/OverviewPage/index.tsx'),server.ssrLoadModule('/src/objects/Weapon.ts')]).then(async([{OverviewPage},{weapons}])=>{
 const profile={primogems:1600,mora:246800,intertwinedFates:5,characters:[{id:'amber',level:3,copies:1},{id:'kaeya',level:1,copies:1}],pity:12,runs:12,weapons:[{id:weapons[0].id,level:2,copies:1}],equipment:[{characterId:'amber',weaponId:weapons[0].id}],weaponPity:0,fourStarPity:4,weaponFourStarPity:2};
 const markup=renderToStaticMarkup(createElement(OverviewPage,{profile,currentUser:{id:'1',username:'traveler',nickname:'旅行者',role:'user',isGuest:false},selected:'amber'})).replaceAll('src="/currency/','src="../../frontend/public/currency/').replaceAll('href="/characters/','href="../../frontend/public/characters/');
 const assets=await fs.readdir(fileURLToPath(new URL('../frontend/dist/assets',import.meta.url)));
 const cssFile=assets.find(name=>name.endsWith('.css'));
 const css=cssFile?await fs.readFile(fileURLToPath(new URL('../frontend/dist/assets/'+cssFile,import.meta.url)),'utf8'):'';
 const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>综合页预览</title><style>'+css+'</style><style>body{margin:0;background:#101b22;color:#e7e2d6;font-family:system-ui}.wrap{max-width:1000px;margin:0 auto;padding:40px 24px}</style><div class="wrap">'+markup+'</div></html>';
 await fs.writeFile(new URL('../docs/assets/overview-preview.html',import.meta.url),html);
 console.log('Saved docs/assets/overview-preview.html');
}).finally(()=>server.close());
