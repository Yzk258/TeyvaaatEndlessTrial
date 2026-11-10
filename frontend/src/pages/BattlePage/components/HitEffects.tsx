import {playerHitTicks,type HitEffect,type PlayerHitEffect} from '../../../game/objects/HitEffect';

export function PlayerHitEffects({hits,tick,reducedMotion}:{hits:readonly PlayerHitEffect[];tick:number;reducedMotion:boolean}){
 return <g aria-hidden="true" pointerEvents="none">{hits.map(hit=>{
  const age=tick-hit.tick;
  const progress=age/playerHitTicks;
  return <g key={hit.tick} data-player-hit-effect="damage" opacity={Math.min(1,(1-progress)*3)}>
   {age<5&&<g transform={'translate('+hit.x+' '+(hit.y-8)+')'} shapeRendering="crispEdges">
    <path d="M -8 -2 H -2 V -8 H 2 V -2 H 8 V 2 H 2 V 8 H -2 V 2 H -8 Z" fill="#ff9b92" stroke="#601f30" strokeWidth="1"/>
    {!reducedMotion&&[0,1,2,3].map(i=>{
     const direction=hit.angle+(i-1.5)*.63,distance=12+age*3;
     return <rect key={i} x={Math.round(Math.cos(direction)*distance)-2} y={Math.round(Math.sin(direction)*distance)-2} width="4" height="4" fill={i%2===0?'#fff2db':'#ff7a70'}/>;
    })}
   </g>}
   <text x={hit.x} y={hit.y-34-(reducedMotion?0:Math.round(progress*22))} textAnchor="middle" fontFamily="monospace" fontWeight="bold"
    fontSize="16" fill="#ff8c86" stroke="#3d1523" strokeWidth="3" paintOrder="stroke">−{Math.round(hit.damage*10)/10}</text>
  </g>;
 })}</g>;
}

export function HitEffects({hits,color,reducedMotion}:{hits:readonly HitEffect[];color:string;reducedMotion:boolean}){
 return <g aria-hidden="true" pointerEvents="none">{hits.map(hit=>{
  const progress=1-hit.life/10,opacity=Math.min(1,hit.life/4);
  const height=hit.enemyKind==='elite'?65:hit.enemyKind==='boss'?58:hit.enemyKind==='slime'?23:34;
  return <g key={hit.id} data-hit-effect={hit.defeated?'defeated':'hit'} opacity={opacity}>
   {hit.life>=5&&<g transform={'translate('+hit.x+' '+(hit.y-7)+')'} shapeRendering="crispEdges">
    <path d="M -8 -2 H -2 V -8 H 2 V -2 H 8 V 2 H 2 V 8 H -2 V 2 H -8 Z" fill="#fff5d8" opacity={hit.life/10}/>
    {!reducedMotion&&Array.from({length:hit.defeated?8:5},(_,i)=>{
     const angle=hit.angle+i*Math.PI*2/(hit.defeated?8:5),distance=7+progress*(hit.defeated?55:30),size=hit.defeated?5:3;
     return <rect key={i} x={Math.round(Math.cos(angle)*distance)-size/2} y={Math.round(Math.sin(angle)*distance)-size/2} width={size} height={size} fill={i%2===0?'#fff5d8':color}/>;
    })}
   </g>}
   {hit.defeated&&hit.life<8&&!reducedMotion&&<g transform={'translate('+hit.x+' '+(hit.y-10)+')'} fill={color} opacity={hit.life/18} shapeRendering="crispEdges"><rect x={-10-progress*12} y={-10-progress*12} width="8" height="8"/><rect x={4+progress*12} y={-4-progress*16} width="6" height="6"/><rect x="-2" y={6+progress*10} width="7" height="7"/></g>}
   <text x={hit.x} y={hit.y-height-(reducedMotion?0:Math.round(progress*22))} textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize={hit.defeated?17:14} fill={hit.defeated?'#ffe3a0':'#fff8e8'} stroke="#26312c" strokeWidth="3" paintOrder="stroke">{Math.round(hit.damage*10)/10}</text>
  </g>;
 })}</g>;
}
