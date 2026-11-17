import {createHash} from 'node:crypto';
import {copyFile,mkdir,readdir,readFile,writeFile} from 'node:fs/promises';

const frontend=new URL('../',import.meta.url);
const dist=new URL('dist/',frontend);
const readConfig=async name=>JSON.parse(await readFile(new URL('../shared/'+name+'.json',frontend),'utf8'));
const [references,display,battle,weapons,enemies]=await Promise.all([
 'character-references','character-display-portraits',
 'character-battle-portraits','weapon-appearance','enemy-appearance'
].map(readConfig));
const imageFiles=(await Promise.all(['artifacts','crystals','enemies/hypostasis'].map(async directory=>{
 const entries=await readdir(new URL('public/'+directory+'/',frontend),{withFileTypes:true});
 return entries.filter(entry=>entry.isFile()&&entry.name.endsWith('.png')).map(entry=>directory+'/'+entry.name);
}))).flat();
const publicFiles=[...new Set([
 '/backgrounds/sky-gate-pixel-v2.png',
 '/backgrounds/sky-gate-clouds-a.png','/backgrounds/sky-gate-clouds-b.png',
 '/terrain/ground-v2.png','/terrain/objects-v2.png','/terrain/ruins-v2.png','/terrain/waypoint-v2.png',
 '/currency/mora.png','/currency/primogem.png','/currency/fate.png',
 ...imageFiles,
 ...Object.values(references).map(entry=>entry.thumbnail??entry.src),
 ...[...display,...battle,...Object.values(weapons),...Object.values(enemies.sheets)].map(entry=>entry.src)
].map(path=>path.replace(/^\//,'')))];
const directories=new Set(publicFiles.map(path=>new URL('.',new URL(path,dist)).href));
for(const directory of directories)await mkdir(new URL(directory),{recursive:true});
await Promise.all(publicFiles.map(path=>copyFile(new URL('public/'+path,frontend),new URL(path,dist))));

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
