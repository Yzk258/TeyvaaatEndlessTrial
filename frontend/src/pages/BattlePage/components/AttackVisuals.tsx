import type {AttackVisual} from '../../../objects/AttackVisual';
import type {Projectile} from '../../../game/objects/Projectile';
import type {AttackEffect} from '../../../game/objects/AttackEffect';
import type {AttackCue} from '../../../game/objects/AttackCue';
function arcPath(x:number,y:number,radius:number,angle:number,degrees:number):string {
 const half=degrees*Math.PI/360,a=angle-half,b=angle+half;
 return 'M '+(x+Math.cos(a)*radius)+' '+(y+Math.sin(a)*radius)+' A '+radius+' '+radius+' 0 '+(degrees>180?1:0)+' 1 '+(x+Math.cos(b)*radius)+' '+(y+Math.sin(b)*radius);
}
// These shapes consume attack output. Their size, lifetime and particles never decide damage.
export function AttackVisuals({visual,projectiles,effects,cue,tick,reducedMotion}:{visual:AttackVisual;projectiles:readonly Projectile[];effects:readonly AttackEffect[];cue:AttackCue|null;tick:number;reducedMotion:boolean}){
 const age=cue?tick-cue.tick:8;
 const cast=!!cue&&age>=0&&age<6;
 return <g aria-hidden="true" pointerEvents="none">
  {effects.map(e=>{
   const progress=reducedMotion?.5:1-e.life/6,opacity=e.life/6;
   return e.kind==='meleeArc'?<g key={e.id} opacity={opacity} data-attack-effect="slash">
    <path d={arcPath(e.x,e.y,e.radius*.82,e.angle-Math.PI/6+progress*Math.PI/3,Math.min(330,e.angleDegrees))} fill="none" stroke={visual.color} strokeOpacity=".2" strokeWidth="15"/>
    <path d={arcPath(e.x,e.y,e.radius*.82,e.angle-Math.PI/6+progress*Math.PI/3,Math.min(330,e.angleDegrees)*.85)} fill="none" stroke={visual.color} strokeWidth="6"/>
    <path d={arcPath(e.x,e.y,e.radius*.86,e.angle-Math.PI/6+progress*Math.PI/3,Math.min(330,e.angleDegrees)*.65)} fill="none" stroke="#fff8df" strokeWidth="2"/>
    {!reducedMotion&&[0,1,2].map(i=>{const angle=e.angle+(i-1)*.4;return <rect key={i} x={e.x+Math.cos(angle)*e.radius*.85-2} y={e.y+Math.sin(angle)*e.radius*.85-2} width="4" height="4" fill={visual.color} shapeRendering="crispEdges"/>;})}
   </g>:<g key={e.id} opacity={opacity} data-attack-effect="area">
    <circle cx={e.x} cy={e.y} r={e.radius*(.4+progress*.6)} fill={visual.color} fillOpacity=".12" stroke={visual.color} strokeWidth="3"/>
    <circle cx={e.x} cy={e.y} r={e.radius*(.2+progress*.5)} fill="none" stroke="#fff5d8" strokeOpacity=".7" strokeWidth="1.5"/>
    {visual.style==='burst'&&<path d={'M '+(e.x-9)+' '+(e.y-37)+' l 18 23 -13 7 17 30 -4 -25 11 -10 Z'} fill={visual.color} stroke="#fff4e6" strokeWidth="1.5"/>}
    {!reducedMotion&&Array.from({length:8},(_,i)=>{const angle=i*Math.PI/4,distance=e.radius*(.35+progress*.7);return <rect key={i} x={e.x+Math.cos(angle)*distance-2} y={e.y+Math.sin(angle)*distance-2} width={i%2?3:5} height={i%2?3:5} fill={i%2?visual.color:'#fff5d8'} shapeRendering="crispEdges"/>;})}
   </g>;
  })}
  {projectiles.map(p=><g key={p.id} data-attack-effect="projectile" transform={'translate('+p.x+' '+p.y+') rotate('+(Math.atan2(p.dy,p.dx)*180/Math.PI)+')'}>
   {visual.style==='arrow'?<g fill="none" strokeLinecap="square">
    {!reducedMotion&&<path d="M -32 0 H -12 M -25 -3 H -18 M -26 3 H -20" stroke={visual.color} strokeWidth="2" opacity=".35"/>}
    <path d="M -18 0 H 9 M 2 -5 L 10 0 L 2 5 M -16 -4 L -11 0 -16 4" stroke={visual.color} strokeWidth="3"/>
    <path d="M -7 0 H 7" stroke="#fff5d8" strokeWidth="1.5"/>
   </g>:<g shapeRendering="crispEdges">
    {!reducedMotion&&<><rect x="-22" y="-2" width="5" height="4" fill={visual.color} opacity=".2"/><rect x="-14" y="-3" width="6" height="6" fill={visual.color} opacity=".45"/></>}
    <circle r={p.radius+5} fill={visual.color} opacity=".16"/><path d={'M 0 '+(-p.radius-2)+' L '+(p.radius+2)+' 0 0 '+(p.radius+2)+' '+(-p.radius-2)+' 0 Z'} fill={visual.color}/>
    <rect x="-2" y="-2" width="4" height="4" fill="#fff8df"/>
   </g>}
  </g>)}
  {cast&&<g data-attack-effect="cast" transform={'translate('+cue.x+' '+cue.y+') rotate('+(cue.angle*180/Math.PI)+')'} opacity={1-age/6}>
   {visual.style==='arrow'?<><path d="M 12 -10 L 18 -6 20 0 18 6 12 10 M 12 -10 L 12 10" fill="none" stroke={visual.color} strokeWidth="2"/><path d="M 19 0 H 33" stroke="#fff5d8" strokeWidth="2"/></>:visual.style==='slash'?<path d={'M 8 6 L '+(25+(reducedMotion?0:age*2))+' -10 L 23 -4 11 9 Z'} fill="#fff5d8" stroke={visual.color} strokeWidth="2"/>:<g transform={'translate(18 0) rotate('+(reducedMotion?0:age*18)+')'}><path d="M 0 -11 L 11 0 0 11 -11 0 Z" fill={visual.color} fillOpacity=".18" stroke={visual.color} strokeWidth="2"/><path d="M -5 0 H 5 M 0 -5 V 5" stroke="#fff5d8" strokeWidth="2"/></g>}
  </g>}
 </g>;
}
