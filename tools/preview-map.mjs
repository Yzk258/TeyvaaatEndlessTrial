import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await server.ssrLoadModule('/src/pages/BattlePage/components/MapTerrain.tsx').then(async({MapTerrain})=>{
 const scene=(seed,viewBox)=>('<svg class="scene" viewBox="'+viewBox+'" aria-hidden="true">'+renderToStaticMarkup(createElement(MapTerrain,{seed,adventure:true,chunkX:1,chunkY:0})).replaceAll('href="/landmarks/','href="../../frontend/public/landmarks/')+'</svg>');
 const seeds=[42,7,1234,2026];
 const cards=seeds.map(seed=>'<article><h2>世界种子 '+seed+'</h2><p>出生点周围 900×540，方格子地形 + 岩山</p>'+scene(seed,'0 0 900 540')+'</article>').join('');
 const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>地图地形预览</title><style>body{margin:0;padding:24px;background:#1c2a22;color:#ece6d9;font-family:system-ui}h1{margin:0 0 8px;font-size:22px;font-weight:500}article{margin-bottom:26px}h2{font-size:15px;font-weight:500;margin:0 0 2px}p{color:#a7b8ab;font-size:12px;margin:0 0 10px}.scene{width:100%;max-width:900px;border:1px solid #ffffff22;border-radius:10px;display:block;background:#5cc162}</style><h1>地形预览 · 方格子生成</h1><p>草丛、花、岩石、灌木、小树、大树为每格随机细节；灰白色块为岩山（多格岩石组成的不可走大山）。</p>'+cards+'</html>';
 await fs.writeFile(new URL('../docs/assets/map-preview.html',import.meta.url),html);
 console.log('Saved docs/assets/map-preview.html');
}).finally(()=>server.close());
