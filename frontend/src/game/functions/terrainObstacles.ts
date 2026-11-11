import {TILE_SIZE,arenaChunks,generateChunk,isArenaTile} from './generateMap';
import type {WorldObstacle} from '../objects/WorldObstacle';
import type {MapDecoration} from '../objects/MapChunk';
const COLLIDERS:Readonly<Partial<Record<MapDecoration['kind'],{readonly dy:number;readonly radius:number}>>>={
 tree:{dy:2,radius:9},bigtree:{dy:4,radius:14},rock:{dy:0,radius:9},bush:{dy:-2,radius:14},
 crag:{dy:0,radius:16},
 ruin:{dy:0,radius:24},windmill:{dy:-4,radius:22},camp:{dy:2,radius:26},
 tower:{dy:-6,radius:26},statue:{dy:-2,radius:20},waypoint:{dy:0,radius:11},
 lantern:{dy:-1,radius:9},signpost:{dy:-1,radius:9},crate:{dy:0,radius:15},
 barrel:{dy:0,radius:11},campfire:{dy:0,radius:13},ore:{dy:0,radius:17},
};
export function terrainObstacles(seed:number,adventure:boolean,chunkX:number,chunkY:number,includeRuins=adventure):readonly WorldObstacle[] {
 const chunks=adventure?Array.from({length:81},(_,i)=>generateChunk(seed,chunkX+i%9-4,chunkY+Math.floor(i/9)-4,includeRuins)):arenaChunks(seed,includeRuins);
 return chunks.flatMap(chunk=>chunk.decorations.flatMap((d,i)=>{
  const id=chunk.x+':'+chunk.y+':'+i;
  const baseX=chunk.x+d.x,baseY=chunk.y+d.y;
  if(!adventure&&!isArenaTile(baseX-TILE_SIZE/2,baseY-TILE_SIZE/2))return [];
  if(d.kind==='ruinArch')return [-23,23].map(dx=>({id:id+':'+dx,kind:d.kind,x:baseX+dx,y:baseY,radius:9}));
  if(d.kind==='ruinWall')return [-19,0,19].map(dx=>({id:id+':'+dx,kind:d.kind,x:baseX+dx,y:baseY,radius:12}));
  if(d.kind==='ruinPillar')return [{id,kind:d.kind,x:baseX,y:baseY,radius:10}];
  const c=COLLIDERS[d.kind];
  if(!c)return [];
  const x=baseX,y=baseY+c.dy;
  return [{id,kind:d.kind,x,y,radius:c.radius}];
 }));
}
