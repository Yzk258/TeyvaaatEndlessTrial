import {createHash} from 'node:crypto';
import {copyFile,mkdir,readdir,readFile,writeFile} from 'node:fs/promises';

const frontend=new URL('../',import.meta.url);
const dist=new URL('dist/',frontend);
const readConfig=async name=>JSON.parse(await readFile(new URL('../shared/'+name+'.json',frontend),'utf8'));
const [portraits,references,display,battle,weapons,enemies]=await Promise.all([
 'character-portraits','character-references','character-display-portraits',
 'character-battle-portraits','weapon-appearance','enemy-appearance'
].map(readConfig));
const publicFiles=[...new Set([
 '/backgrounds/sky-gate-pixel-v2.png',
 '/terrain/ground-v2.png','/terrain/objects-v2.png','/terrain/ruins-v2.png','/terrain/waypoint-v2.png',
 '/currency/mora.png','/currency/primogem.png','/currency/fate.png',
 ...Object.values(portraits).flatMap(entry=>[entry.src,entry.thumbnail].filter(Boolean)),
 ...Object.values(references).map(entry=>entry.thumbnail??entry.src),
 ...[...display,...battle,...Object.values(weapons),...Object.values(enemies.sheets)].map(entry=>entry.src)
].map(path=>path.replace(/^\//,'')))];
await Promise.all(publicFiles.map(async path=>{
 const output=new URL(path,dist);
 await mkdir(new URL('.',output),{recursive:true});
 await copyFile(new URL('public/'+path,frontend),output);
}));

const assets=(await readdir(new URL('assets/',dist),{withFileTypes:true}))
 .filter(entry=>entry.isFile())
 .map(entry=>new URL('assets/'+entry.name,dist).href.slice(dist.href.length));
const paths=['index.html',...assets,...publicFiles].sort();
const hash=createHash('sha256');
let bytes=0;
for(const path of paths){
 const contents=await readFile(new URL(path,dist));
 bytes+=contents.length;
 hash.update(path).update('\0').update(contents);
}
const worker=await readFile(new URL('offline-worker.js',import.meta.url),'utf8');
const version=hash.update(worker).digest('hex').slice(0,16);
await writeFile(new URL('sw.js',dist),
 'const release='+JSON.stringify(version)+';\nconst precachePaths='+JSON.stringify(paths)+';\n'+worker);
console.log('离线资源：'+paths.length+' 个文件，约 '+Math.round(bytes/1024/1024)+' MB');
