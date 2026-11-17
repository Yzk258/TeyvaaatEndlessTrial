import type {Element} from '../../../objects/Element';
import {hypostases} from '../../../objects/Hypostasis';
import type {Enemy} from '../../../game/objects/Enemy';
import type {HypostasisCue,HypostasisZone} from '../../../game/objects/HypostasisAttack';
import {hypostasisAttacksPerExposure,hypostasisCoreOpen,hypostasisImpactTicks} from '../../../game/functions/hypostasisAttacks';
import {HypostasisAuraParticles} from './HypostasisParticles';

type BossVisualProps={enemy:Enemy;element:Element;tick:number};

function ease(value:number){
 const progress=Math.max(0,Math.min(1,value));
 return progress*progress*(3-2*progress);
}

const shellSections=[
 {x:-50,y:-58,directionX:-1,directionY:-1},
 {x:0,y:-58,directionX:1,directionY:-1},
 {x:-50,y:-8,directionX:-1,directionY:1},
 {x:0,y:-8,directionX:1,directionY:1}
] as const;

function ZoneShape({zone,color,impact}:{zone:HypostasisZone;color:string;impact:boolean}){
 const {x,y}=zone;
 const opacity=impact?0.66:0.24;
 const dash=impact?undefined:'8 6';
 if(zone.kind==='line')return <>
  <line x1={x} y1={y} x2={zone.endX} y2={zone.endY} stroke="#152027" strokeWidth={zone.halfWidth*2+4} strokeLinecap="round" opacity=".48"/>
  <line x1={x} y1={y} x2={zone.endX} y2={zone.endY} stroke={color} strokeWidth={zone.halfWidth*2} strokeLinecap="round" opacity={opacity}/>
  <line x1={x} y1={y} x2={zone.endX} y2={zone.endY} stroke={color} strokeWidth={impact?5:2} strokeDasharray={dash}/>
 </>;
 if(zone.kind==='ring')return <>
  <circle cx={x} cy={y} r={(zone.radius+zone.innerRadius)/2} fill="none" stroke={color}
   strokeWidth={zone.radius-zone.innerRadius} opacity={opacity}/>
  <circle cx={x} cy={y} r={zone.radius} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash}/>
  <circle cx={x} cy={y} r={zone.innerRadius} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash}/>
 </>;
 return <circle cx={x} cy={y} r={zone.radius} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={impact?4:2} strokeDasharray={dash}/>;
}

export function HypostasisTelegraphs({cue,element,tick,reducedMotion}:{cue:HypostasisCue;element:Element;tick:number;reducedMotion:boolean}){
 if(tick>=cue.endTick)return null;
 const {color}=hypostases[element];
 return <g aria-hidden="true" pointerEvents="none" data-boss-attack={cue.name}>
  {cue.zones.map((zone,index)=>{
   const age=tick-cue.strikeTick-zone.delay;
   if(age>=hypostasisImpactTicks)return null;
   const impact=age>=0;
   const opacity=reducedMotion?1:impact?1-ease(age/hypostasisImpactTicks):
    0.45+0.55*ease((tick-cue.startTick)/(cue.strikeTick+zone.delay-cue.startTick));
   return <g key={index} opacity={opacity} data-boss-zone={impact?'strike':'warning'}>
    <ZoneShape zone={zone} color={color} impact={impact}/>
   </g>;
  })}
 </g>;
}

export function HypostasisPortrait({enemy,element,tick,spritePrefix,reducedMotion,flashing}:BossVisualProps&{
 spritePrefix:string;reducedMotion:boolean;flashing:boolean
}){
 const {name,color}=hypostases[element];
 const cue=enemy.hypostasis?.cue;
 const exposed=hypostasisCoreOpen(enemy,tick);
 const closesAt=enemy.nextAttackTick??cue?.endTick??tick;
 const openness=reducedMotion?Number(exposed):cue?.exposesCore?
  ease((tick-cue.endTick+3)/8)*ease((closesAt-tick)/8):0;
 const charge=!reducedMotion&&cue?ease((tick-cue.startTick)/(cue.strikeTick-cue.startTick))*(1-ease((tick-cue.strikeTick)/6)):0;
 const lastStrike=cue?.zones.reduce((latest,zone)=>{
  const strike=cue.strikeTick+zone.delay;
  return strike<=tick?Math.max(strike,latest):latest;
 },-Infinity)??-Infinity;
 const recoil=!reducedMotion&&tick-lastStrike<6?Math.sin((tick-lastStrike)/6*Math.PI):0;
 const bob=reducedMotion?0:Math.sin(tick/8)*3;
 const y=bob-7*charge+8*recoil;
 const shellScale=1-.09*charge+.08*recoil;
 const spriteHref='#'+spritePrefix+'-'+enemy.kind;
 const sprite=<use href={spriteHref} x="-50" y="-58" width="100" height="100"/>;
 const flash=flashing&&!exposed?'url(#battle-hit-flash)':undefined;
 return <g role="img" aria-label={name} transform={`translate(${enemy.x} ${enemy.y})`}>
  <ellipse cy="24" rx={30+6*openness} ry="6" fill="#10241f" opacity={.42-.16*openness}/>
  {charge>0&&<ellipse cy="25" rx={30+10*charge} ry={7+2*charge} fill="none" stroke={color} strokeWidth="2" opacity={charge*.8}/>}
  <g style={{transform:`translateY(${y}px) scale(${shellScale})`}}
   className={reducedMotion?undefined:'transition-transform duration-50 ease-linear'} filter={flash}>
   {openness>0&&!reducedMotion?shellSections.map(({x,y,directionX,directionY})=>
    <svg key={`${x}:${y}`} x={x} y={y} width="50" height="50" viewBox={`${x} ${y} 50 50`} overflow="hidden"
     opacity={1-.62*openness} data-boss-shell-section="" className="transition-[transform,opacity] duration-50 ease-linear"
     style={{transform:`translate(${directionX*19*openness}px, ${directionY*13*openness}px)`}}>{sprite}</svg>
   ):<g opacity={exposed?0.25:1}>{sprite}</g>}
  </g>
  {openness>0&&<g shapeRendering="crispEdges" opacity={openness}
   style={{transform:`translateY(${bob-10}px) scale(${0.65+0.35*openness})`}}
   className={reducedMotion?undefined:'transition-[transform,opacity] duration-50 ease-linear'}
   data-boss-core={exposed?'exposed':undefined}>
   <path d="M 0 -18 18 0 0 18 -18 0 Z" fill={color} stroke="#1d2e41" strokeWidth="3"/>
   <path d="M 0 -11 10 0 0 8 -10 0 Z" fill={flashing?'#fff':'#fffbe9'}/>
  </g>}
  {!reducedMotion&&<g transform={`translate(0 ${bob-10})`}>
   <HypostasisAuraParticles element={element} tick={tick} charge={charge} openness={openness}/>
  </g>}
 </g>;
}

export function HypostasisHealth({enemy,element,tick}:BossVisualProps){
 const state=enemy.hypostasis;
 if(!state)return null;
 const {name,color}=hypostases[element];
 const exposed=hypostasisCoreOpen(enemy,tick);
 const cue=state.cue;
 const casting=cue&&tick<cue.endTick?cue:undefined;
 const round=cue?(state.attacks-1)%hypostasisAttacksPerExposure+1:0;
 const hp=Math.max(0,enemy.hp);
 return <div className="pointer-events-none absolute inset-x-4 top-3 z-10 mx-auto max-w-sm rounded-lg bg-[#101e25]/65 px-3 py-2 text-xs sm:top-5">
  <div className="mb-1.5 flex items-center justify-between gap-2">
   <span className="font-medium text-amber-50">{name}</span>
   <span style={{color}}>{exposed?'核心暴露':(casting?.name??'外壳防护')}
    {!exposed&&round>0&&<span className="ml-2 tabular-nums text-stone-200">{round}/{hypostasisAttacksPerExposure}</span>}
   </span>
  </div>
  <div role="progressbar" aria-label={name+'生命值'} aria-valuemin={0} aria-valuemax={state.maxHp} aria-valuenow={hp}
   className="h-1.5 overflow-hidden rounded-full bg-black/50">
   <div className="h-full rounded-full transition-[width] duration-150 ease-out motion-reduce:transition-none"
    style={{width:100*hp/state.maxHp+'%',backgroundColor:color}}/>
  </div>
 </div>;
}
