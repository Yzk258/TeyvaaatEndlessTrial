import type {MapChunk,MapDecoration} from '../objects/MapChunk';
import type {MapTile,MapTileKind,RuinTileKind} from '../objects/MapTile';
export const CHUNK_SIZE=384;
export const TILE_SIZE=32;
const CELLS=CHUNK_SIZE/TILE_SIZE;
export function mapHash(seed:number,x:number,y:number,salt:number):number {
 const mixed=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(salt,1274126177)^seed;
 const n=Math.imul(mixed^(mixed>>>13),1274126177);
 return (n^(n>>>16))>>>0;
}
export function terrainNoise(seed:number,x:number,y:number,scale:number,salt:number):number {
 const gx=Math.floor(x/scale),gy=Math.floor(y/scale),smooth=(v:number)=>v*v*(3-2*v);
 const tx=smooth(x/scale-gx),ty=smooth(y/scale-gy);
 const value=(dx:number,dy:number)=>mapHash(seed,gx+dx,gy+dy,salt)/4294967295;
 return (value(0,0)*(1-tx)+value(1,0)*tx)*(1-ty)+(value(0,1)*(1-tx)+value(1,1)*tx)*ty;
}
// Continuous open lanes reserve traversable connections across region boundaries.
export function isTerrainLane(x:number,y:number):boolean {
 const distance=(v:number)=>Math.abs(v-Math.round(v/24)*24);
 return distance(x-9-1.6*Math.sin((y-5)/9))<2.2||distance(y-5-1.6*Math.sin((x-9)/9))<2.2;
}
const clearCell=(x:number,y:number)=>Math.hypot((x+.5)*TILE_SIZE-450,(y+.5)*TILE_SIZE-270)<160||isTerrainLane(x,y);
export function isWaterCell(seed:number,x:number,y:number):boolean {
 return !clearCell(x,y)&&terrainNoise(seed,x,y,14,301)*.76+terrainNoise(seed,x,y,5,302)*.24<.32;
}
export function terrainMovementFactor(seed:number,x:number,y:number):number {
 return isWaterCell(seed,Math.floor(x/TILE_SIZE),Math.floor(y/TILE_SIZE)) ? .5 : 1;
}
const neighbors=[[-1,0],[1,0],[0,-1],[0,1]] as const;
export function terrainCellKind(seed:number,x:number,y:number):MapTileKind {
 if(isWaterCell(seed,x,y))return 'water';
 if(neighbors.some(([dx,dy])=>isWaterCell(seed,x+dx,y+dy)))return 'sand';
 const roll=mapHash(seed,x,y,11)%100;
 if(clearCell(x,y))return roll<22?'tallGrass':'meadow';
 const stone=terrainNoise(seed,x,y,5,401);
 if(stone>.72)return 'rockCluster';
 if(stone>.64)return roll<55?'rock':roll<75?'rockCluster':'meadow';
 const forest=terrainNoise(seed,x,y,9,501),grass=terrainNoise(seed,x,y,4,502);
 const priority=mapHash(seed,x,y,510);
 if(forest>.49&&roll<65&&neighbors.every(([dx,dy])=>priority>mapHash(seed,x+dx,y+dy,510)))return 'tree';
 if(grass>.51||forest>.64)return roll<83?'tallGrass':'meadow';
 return roll<4?'rock':roll<18?'tallGrass':'meadow';
}
function findWaypointCell(seed:number,chunkX:number,chunkY:number){
 const regionX=Math.floor(chunkX/2),regionY=Math.floor(chunkY/2),regionSize=CELLS*2;
 const startRegion=regionX===0&&regionY===0;
 const spacing=4,columns=Math.floor(regionSize/spacing);
 const candidates=Array.from({length:columns*columns},(_,index)=>{
  const x=regionX*regionSize+spacing/2+index%columns*spacing;
  const y=regionY*regionSize+spacing/2+Math.floor(index/columns)*spacing;
  const priority=startRegion?Math.hypot((x+.5)*TILE_SIZE-450,(y+.5)*TILE_SIZE-270):mapHash(seed,x,y,933);
  return {x,y,priority};
 }).toSorted((a,b)=>a.priority-b.priority);
 const isOpen=(x:number,y:number)=>{
  const kind=terrainCellKind(seed,x,y);
  return kind==='meadow'||kind==='tallGrass';
 };
 return candidates.find(({x,y})=>!clearCell(x,y)&&isOpen(x,y)&&neighbors.every(([dx,dy])=>isOpen(x+dx,y+dy)));
}
const ruinFeatures=[
 {x:0,y:-2,kind:'ruinArch'},
 {x:-2,y:-2,kind:'ruinWall'},
 {x:2,y:-2,kind:'ruinWall'},
 {x:-2,y:1,kind:'ruinPillar'},
 {x:2,y:0,kind:'ruinPillar'}
] as const;
const ruinFootprint=Array.from({length:35},(_,i)=>({x:i%7-3,y:Math.floor(i/7)-2}));
const ruinApproaches=[{x:-1,y:3},{x:0,y:3},{x:1,y:3},{x:0,y:-3}] as const;
const ruinSolidCells=ruinFeatures.flatMap(({x,y,kind})=>
 (kind==='ruinPillar'?[0]:[-1,0,1]).map(dx=>({x:x+dx,y})));

function findRuinCenter(seed:number,chunkX:number,chunkY:number){
 const regionX=Math.floor(chunkX/4),regionY=Math.floor(chunkY/4),regionSize=CELLS*4;
 const startRegion=regionX===0&&regionY===0;
 const waypoints=Array.from({length:4},(_,index)=>findWaypointCell(seed,regionX*4+index%2*2,regionY*4+Math.floor(index/2)*2));
 const spacing=4,padding=5,columns=Math.floor((regionSize-2*padding)/spacing)+1;
 const candidates=Array.from({length:columns*columns},(_,index)=>{
  const x=regionX*regionSize+padding+index%columns*spacing;
  const y=regionY*regionSize+padding+Math.floor(index/columns)*spacing;
  const priority=startRegion?Math.hypot((x+.5)*TILE_SIZE-450,(y+.5)*TILE_SIZE-270):mapHash(seed,x,y,941);
  return {x,y,priority};
 }).toSorted((a,b)=>a.priority-b.priority);
 return candidates.find(({x,y})=>
  ruinSolidCells.every(cell=>!clearCell(x+cell.x,y+cell.y))&&
  waypoints.every(point=>!point||Math.abs(point.x-x)>4||Math.abs(point.y-y)>4)&&
  [...ruinFootprint,...ruinApproaches].every(cell=>!isWaterCell(seed,x+cell.x,y+cell.y)));
}
export function generateChunk(seed:number,chunkX:number,chunkY:number,includeRuins=true):MapChunk {
 const waypoint=findWaypointCell(seed,chunkX,chunkY);
 const ruins=includeRuins?findRuinCenter(seed,chunkX,chunkY):undefined;
 const tiles:readonly MapTile[]=Array.from({length:CELLS*CELLS},(_,i)=>{
  const gx=chunkX*CELLS+i%CELLS,gy=chunkY*CELLS+Math.floor(i/CELLS);
  const relative=ruins?{x:gx-ruins.x,y:gy-ruins.y}:undefined;
  const inCourtyard=relative&&Math.abs(relative.x)<=3&&relative.y>=-2&&relative.y<=2;
  const inApproach=relative&&ruinApproaches.some(cell=>cell.x===relative.x&&cell.y===relative.y);
  const ruinKind:RuinTileKind|undefined=inCourtyard
   ?ruinFeatures.find(feature=>feature.x===relative.x&&feature.y===relative.y)?.kind??'ruinFloor'
   :inApproach?'ruinFloor':undefined;
  const kind=ruinKind??(waypoint?.x===gx&&waypoint.y===gy?'waypoint':terrainCellKind(seed,gx,gy));
  return {x:i%CELLS*TILE_SIZE,y:Math.floor(i/CELLS)*TILE_SIZE,kind,variant:mapHash(seed,gx,gy,15)%3,
   shade:Math.floor(terrainNoise(seed,gx,gy,6,701)*4),
   shore:kind==='water'?neighbors.reduce((mask,[dx,dy],n)=>mask|(!isWaterCell(seed,gx+dx,gy+dy)?1<<n:0),0):0};
 });
 const decorations:readonly MapDecoration[]=tiles.flatMap(t=>{
  const kind=t.kind==='rockCluster'?'crag':t.kind==='tallGrass'?'grass':
   t.kind==='meadow'||t.kind==='sand'||t.kind==='ruinFloor'?null:t.kind;
  return kind?[{x:t.x+TILE_SIZE/2,y:t.y+TILE_SIZE/2,kind,variant:t.variant}]:[];
 });
 return {x:chunkX*CHUNK_SIZE,y:chunkY*CHUNK_SIZE,tint:0,tiles,decorations};
}
export function nearbyChunks(seed:number,chunkX:number,chunkY:number):readonly MapChunk[] {
 return Array.from({length:25},(_,i)=>generateChunk(seed,chunkX+i%5-2,chunkY+Math.floor(i/5)-2));
}
