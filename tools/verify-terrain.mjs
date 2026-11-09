import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServer} from '../frontend/node_modules/vite/dist/node/index.js';
import {createElement} from '../frontend/node_modules/react/index.js';
import {renderToStaticMarkup} from '../frontend/node_modules/react-dom/server.node.js';
const server=await createServer({root:fileURLToPath(new URL('../frontend',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom'});
await Promise.all([server.ssrLoadModule('/src/game/functions/generateMap.ts'),server.ssrLoadModule('/src/game/functions/terrainObstacles.ts'),server.ssrLoadModule('/src/game/functions/collisionGeometry.ts'),server.ssrLoadModule('/src/pages/BattlePage/components/MapTerrain.tsx')]).then(async([map,collision,geometry,{MapTerrain}])=>{
 const {generateChunk,terrainCellKind,isTerrainLane,isWaterCell}=map;
 const seeds=[42,12345,20261108,719,91821];
 const kinds=seeds.flatMap(seed=>Array.from({length:81},(_,i)=>generateChunk(seed,i%9-4,Math.floor(i/9)-4)).flatMap(chunk=>{
  assert.equal(chunk.tiles.length,144);
  assert.equal(new Set(chunk.tiles.map(t=>t.x+':'+t.y)).size,144);
  assert.deepEqual(chunk,generateChunk(seed,chunk.x/384,chunk.y/384));
  return chunk.tiles.map(tile=>{
   const gx=(chunk.x+tile.x)/32,gy=(chunk.y+tile.y)/32;
   const baseKind=terrainCellKind(seed,gx,gy);
   if(tile.kind.startsWith('ruin')){
    assert.notEqual(baseKind,'water');
   }else if(tile.kind==='waypoint'){
    assert.ok(['meadow','tallGrass'].includes(baseKind));
    assert.ok(Math.hypot((gx+.5)*32-450,(gy+.5)*32-270)>=160);
    assert.ok([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dy])=>['meadow','tallGrass'].includes(terrainCellKind(seed,gx+dx,gy+dy))));
   }else assert.equal(tile.kind,baseKind);
   if(isTerrainLane(gx,gy))assert.ok(['meadow','tallGrass','sand','ruinFloor'].includes(tile.kind));
   if(tile.kind==='sand')assert.ok([[-1,0],[1,0],[0,-1],[0,1]].some(([x,y])=>isWaterCell(seed,gx+x,gy+y)));
   return tile.kind;
  });
 }));
 assert.equal(new Set(kinds).size,12);
 seeds.forEach(seed=>{
  const obstacles=collision.terrainObstacles(seed,true,1,0);
  assert.ok(geometry.canStand(450,270,12,obstacles,null));
  const water=obstacles.filter(o=>o.kind==='water');
  assert.ok(water.length>0);
  const waypoints=obstacles.filter(o=>o.kind==='waypoint');
  assert.ok(waypoints.length>0);
  assert.equal(new Set(waypoints.map(o=>Math.floor(o.x/768)+':'+Math.floor(o.y/768))).size,waypoints.length);
  assert.ok(waypoints.every(o=>o.radius===11&&!geometry.canStand(o.x,o.y,12,obstacles,null)));
  const arches=obstacles.filter(o=>o.kind==='ruinArch'&&o.id.endsWith(':-23'));
  assert.ok(arches.length>0);
  arches.forEach(leftFoot=>{
   const centerX=leftFoot.x+23;
   assert.equal(geometry.canStand(leftFoot.x,leftFoot.y,12,obstacles,null),false);
   assert.ok(geometry.canStand(centerX,leftFoot.y,12,obstacles,null),'Arch opening blocked');
   assert.ok(geometry.canMove(centerX,leftFoot.y-32,centerX,leftFoot.y+32,12,obstacles),'Arch approach blocked');
   assert.ok(geometry.canMove(centerX,leftFoot.y+160,centerX,leftFoot.y+32,12,obstacles),'Courtyard entrance blocked');
  });
  const laneObstacles=collision.terrainObstacles(seed,true,0,0);
  Array.from({length:97},(_,i)=>i/2-24).forEach(cx=>{
   const cy=5+1.6*Math.sin((cx-9)/9);
   assert.ok(geometry.canStand((cx+.5)*32,(cy+.5)*32,12,laneObstacles,null),'Open lane blocked');
  });
  water.slice(0,30).forEach(o=>assert.equal(geometry.canStand(o.x,o.y,12,obstacles,null),false));
 });
 const coherent=seeds.map(seed=>{
  const cells=Array.from({length:4096},(_,i)=>({x:i%64-32,y:Math.floor(i/64)-32})).filter(c=>isWaterCell(seed,c.x,c.y));
  return cells.filter(c=>[[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>isWaterCell(seed,c.x+dx,c.y+dy))).length/cells.length;
 });
 assert.ok(coherent.every(r=>r>.97));
 const [{BattleScene},{initialBattle},{characters}]=await Promise.all([server.ssrLoadModule('/src/pages/BattlePage/components/BattleScene.tsx'),server.ssrLoadModule('/src/game/functions/stepBattle.ts'),server.ssrLoadModule('/src/objects/Character.ts')]);
 const ruinsArch=collision.terrainObstacles(12345,true,1,0).find(o=>o.kind==='ruinArch'&&o.id.endsWith(':-23')&&o.x>=0&&o.x<1536&&o.y>=0&&o.y<1536);
 assert.ok(ruinsArch);
 const previewState={...initialBattle(12345),x:ruinsArch.x+23,y:ruinsArch.y+80};
 const battle=renderToStaticMarkup(createElement(BattleScene,{state:previewState,character:characters[0],bounded:false,reducedMotion:true})).replaceAll('href="/','href="../frontend/public/');
 await fs.mkdir(new URL('../.local/',import.meta.url),{recursive:true});
 await fs.writeFile(new URL('../.local/ruins-scene.html',import.meta.url),'<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#172c27}svg{width:100%;height:100%}svg svg{width:revert;height:revert}image{image-rendering:pixelated}</style><div style="width:1200px;height:720px">'+battle+'</div>');
 const panels=[{seed:42,cx:0,cy:0},{seed:12345,cx:-1,cy:0},{seed:20261108,cx:2,cy:1}].map(({seed,cx,cy})=>'<section><h2>Seed '+seed+'</h2>'+renderToStaticMarkup(createElement('svg',{viewBox:`${cx*384-576} ${cy*384-384} 1536 1152`,width:768,height:576},createElement(MapTerrain,{seed,adventure:true,chunkX:cx,chunkY:cy})))+'</section>');
 await fs.mkdir(new URL('../docs/assets/',import.meta.url),{recursive:true});
 await fs.writeFile(new URL('../docs/assets/terrain-grid.html',import.meta.url),'<!doctype html><meta charset="utf-8"><style>body{margin:20px;background:#172c27;color:#e9ead5;font:14px system-ui}image{image-rendering:pixelated}main{display:flex;flex-wrap:wrap;gap:18px}section{width:768px}h2{margin:6px}</style><h1>格子地形 · 连续水域、岩群与植被</h1><main>'+panels.join('').replaceAll('href="/terrain/','href="../../frontend/public/terrain/')+'</main>');
 console.log('PASS: 5个种子、405个区块、每格唯一要素、跨块一致、陆路净空、遗迹入口与拱门可通行、出生安全、水域碰撞、全部类型覆盖；水域邻格连贯率 '+coherent.map(r=>(r*100).toFixed(1)+'%').join(' / '));
}).finally(()=>server.close());
