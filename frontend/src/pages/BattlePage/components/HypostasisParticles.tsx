import type {Element} from '../../../objects/Element';
import {hypostases} from '../../../objects/Hypostasis';
import type {HypostasisCue,HypostasisZone} from '../../../game/objects/HypostasisAttack';
import {hypostasisImpactTicks} from '../../../game/functions/hypostasisAttacks';

type ParticleStyle={
 shape:string;
 highlight:string;
 accent:string;
 lift:number;
 curl:number;
 spin:number;
};

const particleStyles={
 cryo:{
  shape:'M 0 -7 3 -3 2 2 0 7 -2 3 -3 -3 Z M -6 0 H 6 V 2 H -6 Z',
  highlight:'M 0 -4 V 5 M -4 1 H 4',accent:'#eeffff',lift:9,curl:0.25,spin:95
 },
 anemo:{
  shape:'M -9 3 Q -4 -5 3 -4 Q 9 -4 9 0 Q 7 3 3 1 Q -2 0 -9 3 Z',
  highlight:'M -7 5 Q -1 1 5 3',accent:'#d4fff4',lift:12,curl:1.4,spin:35
 },
 pyro:{
  shape:'M -1 -8 3 -5 2 -2 5 -3 4 2 2 5 -2 5 -4 2 -3 -2 -1 -1 Z',
  highlight:'M -1 3 1 0 2 2 1 4 Z',accent:'#ffe19b',lift:35,curl:0.34,spin:40
 },
 electro:{
  shape:'M -6 4 -1 -2 -3 -3 5 -7 2 -2 5 -1 -2 3 1 3 -5 7 Z',
  highlight:'M -5 4 -1 0 0 -2 4 -5',accent:'#f5d5ff',lift:5,curl:0.6,spin:200
 },
 hydro:{
  shape:'M 0 -7 4 -1 4 3 2 5 -2 5 -4 3 -4 -1 Z M 5 -3 H 7 V -1 H 5 Z',
  highlight:'M -2 0 V 2 H 0',accent:'#daffff',lift:17,curl:0.8,spin:55
 },
 dendro:{
  shape:'M -6 4 -4 -1 0 -4 6 -5 4 1 1 4 -3 5 Z',
  highlight:'M -5 4 3 -3 M -1 1 1 2',accent:'#ecffbc',lift:24,curl:0.9,spin:150
 },
 geo:{
  shape:'M -5 -3 0 -6 5 -3 5 2 1 5 -5 2 Z M 5 3 H 8 V 6 H 5 Z',
  highlight:'M -4 -3 0 -5 4 -3 0 0 -4 -3 M 0 0 V 4',accent:'#fff0b0',lift:7,curl:0.15,spin:120
 }
} as const satisfies Record<Element,ParticleStyle>;

const orbitCount=7;
const impactCount=10;
const afterglowTicks=5;
const impactLifetime=hypostasisImpactTicks+afterglowTicks;
const radialStep=Math.PI*(3-Math.sqrt(5));

function Particle({element,x,y,angle,size,opacity}:{element:Element;x:number;y:number;angle:number;size:number;opacity:number}){
 const style=particleStyles[element];
 return <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(1)}) scale(${size.toFixed(2)})`} opacity={opacity}>
  <path d={style.shape} fill={hypostases[element].color}/>
  <path d={style.highlight} fill="none" stroke={style.accent} strokeWidth="1.2"/>
 </g>;
}

export function HypostasisAuraParticles({element,tick,charge,openness}:{
 element:Element;tick:number;charge:number;openness:number
}){
 const strength=Math.max(charge,openness);
 if(strength<=0)return null;
 const style=particleStyles[element];
 const radius=openness>0?15+18*openness:57-26*charge;
 return <g aria-hidden="true" pointerEvents="none" data-boss-particles={element}
  data-particle-phase={openness>0?'core':'charge'}>
  {Array.from({length:orbitCount},(_,index)=>{
   const angle=index*2*Math.PI/orbitCount+tick*(0.026+style.curl*0.035);
   const ripple=Math.sin(index*2+tick*.16);
   const distance=radius+4*ripple;
   return <Particle key={index} element={element}
    x={Math.cos(angle)*distance} y={Math.sin(angle)*distance*.63-style.lift*.14*ripple}
    angle={angle*180/Math.PI+tick*style.spin*.045}
    size={0.48+(index%3)*0.14} opacity={strength*(0.55+0.16*(index%3))}/>;
  })}
 </g>;
}

function impactPoint(zone:HypostasisZone,index:number,progress:number,style:ParticleStyle){
 const offset=index*radialStep;
 const elevation=Math.sin(progress*Math.PI*.72)*style.lift;
 if(zone.kind==='line'){
  const dx=zone.endX-zone.x,dy=zone.endY-zone.y,length=Math.hypot(dx,dy)||1;
  const along=(index+.5)/impactCount+progress*.05;
  const across=Math.sin(offset+progress*style.curl)*zone.halfWidth*.8;
  return {
   x:zone.x+dx*along-dy/length*across,
   y:zone.y+dy*along+dx/length*across-elevation,
   angle:Math.atan2(dy,dx)*180/Math.PI
  };
 }
 const angle=offset+progress*style.curl;
 const inner=zone.kind==='ring'?zone.innerRadius:0;
 const distance=inner+(zone.radius-inner)*(0.22+(index%4)*.13+progress*.28);
 return {x:zone.x+Math.cos(angle)*distance,y:zone.y+Math.sin(angle)*distance-elevation,angle:angle*180/Math.PI};
}

export function HypostasisImpactParticles({cue,element,tick}:{cue:HypostasisCue;element:Element;tick:number}){
 if(tick<cue.strikeTick||tick>=cue.endTick+afterglowTicks)return null;
 const style=particleStyles[element];
 return <g aria-hidden="true" pointerEvents="none" data-boss-particles={element} data-particle-phase="impact">
  {cue.zones.map((zone,zoneIndex)=>{
   const age=tick-cue.strikeTick-zone.delay;
   if(age<0||age>=impactLifetime)return null;
   const progress=age/impactLifetime;
   return <g key={zoneIndex} data-particle-zone={zone.kind}>
    {Array.from({length:impactCount},(_,index)=>{
     const {x,y,angle}=impactPoint(zone,index,progress,style);
     return <Particle key={index} element={element} x={x} y={y}
      angle={angle+style.spin*progress} size={0.6+(index%3)*.23}
      opacity={(1-progress)*(.95-(index%3)*.12)}/>;
    })}
   </g>;
  })}
 </g>;
}
