import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await server.ssrLoadModule('/src/pages/ActivitiesPage/index.tsx').then(async({ActivitiesPage})=>{
 const markup=renderToStaticMarkup(createElement(ActivitiesPage)).replaceAll('src="/currency/','src="../../frontend/public/currency/');
 const assets=await fs.readdir(fileURLToPath(new URL('../frontend/dist/assets',import.meta.url)));
 const cssFile=assets.find(name=>name.endsWith('.css'));
 const css=cssFile?await fs.readFile(fileURLToPath(new URL('../frontend/dist/assets/'+cssFile,import.meta.url)),'utf8'):'';
 const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>活动页预览</title><style>'+css+'</style><style>body{margin:0;background:#101b22;color:#e7e2d6;font-family:system-ui}.wrap{max-width:1000px;margin:0 auto;padding:40px 24px}</style><div class="wrap">'+markup+'</div></html>';
 await fs.writeFile(new URL('../docs/assets/activities-preview.html',import.meta.url),html);
 console.log('Saved docs/assets/activities-preview.html');
}).finally(()=>server.close());
