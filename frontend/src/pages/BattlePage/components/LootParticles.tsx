import type {LootParticle} from '../../../game/objects/LootParticle';
import {gameAsset} from '../../../system/gameAsset';
export function LootParticles({particles,x,y,reducedMotion}:{particles:readonly LootParticle[];x:number;y:number;reducedMotion:boolean}){
 return <g aria-hidden="true" pointerEvents="none" shapeRendering="crispEdges">{particles.slice(-256).map(p=>{
  if(p.kind==='artifact')return <g key={p.id} data-loot="artifact" opacity={p.phase==='absorbed'?1-p.age/6:1}>
   <rect x={p.x-13} y={p.y-13} width="26" height="26" rx="4" fill="#20352f" stroke="#e7e5e4"/>
   <image href={gameAsset('/artifacts/'+p.artifactId+'.png')} x={p.x-12} y={p.y-12} width="24" height="24" imageRendering="pixelated"/>
  </g>;
  const color=p.kind==='experience'?'#8ce7ff':'#ffd36c',radius=p.value>=20?4:3;
  const distance=Math.hypot(p.x-x,p.y-y)||1,tailX=(p.x-x)/distance,tailY=(p.y-y)/distance;
  return p.phase==='absorbed'?<g key={p.id} data-loot="absorbed" opacity={1-p.age/6}>
   <rect x={p.x-5-(reducedMotion?0:p.age*2)} y={p.y-5-(reducedMotion?0:p.age*2)} width="3" height="3" fill={color}/><rect x={p.x+3+(reducedMotion?0:p.age*2)} y={p.y+3+(reducedMotion?0:p.age*2)} width="3" height="3" fill={color}/>
  </g>:<g key={p.id} data-loot={p.kind}>
   {p.phase==='attract'&&!reducedMotion&&[1,2,3].map(i=><rect key={i} x={p.x+tailX*i*5-1} y={p.y+tailY*i*5-1} width={3-i*.5} height={3-i*.5} fill={color} opacity={.55-i*.12}/>)}
   <rect x={p.x-radius-2} y={p.y-radius-2} width={(radius+2)*2} height={(radius+2)*2} fill={color} opacity=".12"/>
   {p.kind==='experience'?<path d={'M '+p.x+' '+(p.y-radius)+' l '+radius+' '+radius+' -'+radius+' '+radius+' -'+radius+' -'+radius+' Z'} fill={color}/>:<rect x={p.x-radius} y={p.y-radius} width={radius*2} height={radius*2} fill={color}/>}
   <rect x={p.x-1} y={p.y-1} width="2" height="2" fill="#fffbe0"/>
  </g>;
 })}</g>;
}
