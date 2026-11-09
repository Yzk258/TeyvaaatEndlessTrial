import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await server.ssrLoadModule('/src/pages/OpeningPage/index.tsx').then(async({OpeningPage})=>{
 const markup=renderToStaticMarkup(createElement(OpeningPage,{status:'ready',pending:false,initialLogin:false,authRevision:0,user:null,onEnter:()=>{},onRetry:()=>{},onLogin:()=>{},onRegister:()=>{}})).replaceAll('src="/backgrounds/','src="../../frontend/public/backgrounds/');
 const assets=await fs.readdir(fileURLToPath(new URL('../frontend/dist/assets',import.meta.url)));
 const cssFile=assets.find(name=>name.endsWith('.css'));
 const css=cssFile?await fs.readFile(fileURLToPath(new URL('../frontend/dist/assets/'+cssFile,import.meta.url)),'utf8'):'';
 const html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>开场界面预览</title><style>'+css+'</style><style>html,body{margin:0;height:100%;background:#111e25}body>main{min-height:100vh!important}#stage{width:100%;height:100vh}</style><div id="stage">'+markup+'</div></html>';
 await fs.writeFile(new URL('../docs/assets/opening-preview.html',import.meta.url),html);
 console.log('Saved docs/assets/opening-preview.html');
}).finally(()=>server.close());
