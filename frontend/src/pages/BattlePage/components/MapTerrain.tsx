import {memo,useMemo,useId} from 'react';
import {generateChunk,nearbyChunks,TILE_SIZE} from '../../../game/functions/generateMap';
import type {MapTile} from '../../../game/objects/MapTile';
const groundAtlas='/terrain/ground-v2.png',objectAtlas='/terrain/objects-v2.png';
const ruinAtlas='/terrain/ruins-v2.png';
const textures=[{name:'meadow',x:0,y:0},{name:'sand',x:500,y:0},{name:'water',x:0,y:500},{name:'stone',x:500,y:500}] as const;
function Ground({tile:t,id}:{tile:MapTile;id:string}){
 const material=t.kind.startsWith('ruin')?'paving':t.kind==='water'?'water':t.kind==='sand'?'sand':t.kind==='rockCluster'?'stone':'meadow';
 return <g><rect shapeRendering="crispEdges" x={t.x} y={t.y} width={TILE_SIZE} height={TILE_SIZE} fill={'url(#'+id+'-'+material+')'}/>
  {t.kind==='water'&&<g transform={'translate('+t.x+' '+t.y+')'} shapeRendering="crispEdges" fill="#bdd9bd">
   {!!(t.shore&1)&&<path d="M 0 0 h 3 v 8 h -1 v 8 h 2 v 8 h -1 v 8 h -3 Z"/>}
   {!!(t.shore&2)&&<path d="M 32 0 h -3 v 8 h 1 v 8 h -2 v 8 h 1 v 8 h 3 Z"/>}
   {!!(t.shore&4)&&<path d="M 0 0 v 3 h 8 v -1 h 8 v 2 h 8 v -1 h 8 v -3 Z"/>}
   {!!(t.shore&8)&&<path d="M 0 32 v -3 h 8 v 1 h 8 v -2 h 8 v 1 h 8 v 3 Z"/>}
  </g>}
 </g>;
}
function Feature({tile:t}:{tile:MapTile}){
 if(t.kind==='waypoint'){
  const x=t.x+TILE_SIZE/2,y=t.y+TILE_SIZE/2;
  return <image href="/terrain/waypoint-v2.png" x={x-25} y={y-62} width="50" height="75" className="[image-rendering:pixelated]" data-map-feature="waypoint"/>;
 }
 const ruin=t.kind==='ruinArch'?{box:'48 17 412 446',w:72,h:78,foot:8}:
  t.kind==='ruinWall'?{box:'526 166 450 200',w:64,h:29,foot:8}:
  t.kind==='ruinPillar'?{box:'113 520 266 447',w:28,h:52,foot:7}:null;
 if(ruin){
  const x=t.x+TILE_SIZE/2,y=t.y+TILE_SIZE/2;
  return <svg x={x-ruin.w/2} y={y-ruin.h+ruin.foot} width={ruin.w} height={ruin.h} viewBox={ruin.box} overflow="hidden" preserveAspectRatio="none" data-map-feature={t.kind}>
   <image href={ruinAtlas} width="1000" height="1000" preserveAspectRatio="none" className="[image-rendering:pixelated]"/>
  </svg>;
 }
 const asset=t.kind==='tree'?{box:'0 0 500 500',w:44+t.variant*4,h:50+t.variant*4,foot:4}:
  t.kind==='rock'?{box:'530 130 430 300',w:28,h:22,foot:8}:
  t.kind==='rockCluster'?{box:'20 560 450 350',w:36,h:30,foot:12}:
  t.kind==='tallGrass'?{box:'500 530 490 420',w:36+t.variant*2,h:27+t.variant*2,foot:9}:null;
 if(!asset)return null;
 const x=t.x+TILE_SIZE/2+(t.kind==='tallGrass'?(t.variant-1)*3:0),y=t.y+TILE_SIZE/2;
 return <g transform={t.variant===1?'translate('+(2*x)+' 0) scale(-1 1)':undefined}><svg x={x-asset.w/2} y={y-asset.h+asset.foot} width={asset.w} height={asset.h} viewBox={asset.box} overflow="hidden" preserveAspectRatio="none">
  <image href={objectAtlas} x="0" y="0" width="1000" height="1000" preserveAspectRatio="none" className="[image-rendering:pixelated]"/>
 </svg></g>;
}
export const MapTerrain=memo(function MapTerrain({seed,adventure,chunkX,chunkY}:{seed:number;adventure:boolean;chunkX:number;chunkY:number}){
 const id=useId().replaceAll(':','');
 const tiles=useMemo(()=>{
  const chunks=adventure?nearbyChunks(seed,chunkX,chunkY):Array.from({length:6},(_,i)=>generateChunk(seed,i%3,Math.floor(i/3),false));
  return chunks.flatMap(chunk=>chunk.tiles.map(t=>({...t,x:chunk.x+t.x,y:chunk.y+t.y})))
   .map(t=>!adventure&&(t.x<48||t.x+TILE_SIZE>852||t.y<48||t.y+TILE_SIZE>492)?{...t,kind:'meadow' as const}:t);
 },[seed,adventure,chunkX,chunkY]);
 return <g aria-hidden="true" pointerEvents="none"><defs>{textures.map(texture=><pattern key={texture.name} id={id+'-'+texture.name} width="64" height="64" patternUnits="userSpaceOnUse">
  <svg width="64" height="64" viewBox={texture.x+' '+texture.y+' 500 500'} overflow="hidden" preserveAspectRatio="none"><image href={groundAtlas} width="1000" height="1000" preserveAspectRatio="none" className="[image-rendering:pixelated]"/></svg>
 </pattern>)}<pattern id={id+'-paving'} width="96" height="96" patternUnits="userSpaceOnUse">
  <svg width="96" height="96" viewBox="516 516 463 463" overflow="hidden" preserveAspectRatio="none"><image href={ruinAtlas} width="1000" height="1000" preserveAspectRatio="none" className="[image-rendering:pixelated]"/></svg>
 </pattern></defs>
  {tiles.map(t=><Ground key={t.x+':'+t.y} tile={t} id={id}/>)}
  {tiles.filter(t=>!['water','meadow','sand','ruinFloor'].includes(t.kind)).toSorted((a,b)=>a.y-b.y||a.x-b.x).map(t=><Feature key={t.x+':'+t.y} tile={t}/>)}
  {!adventure&&<rect x="14" y="14" width="872" height="512" fill="none" stroke="#b4ad81" strokeWidth="8"/>}
 </g>;
});
