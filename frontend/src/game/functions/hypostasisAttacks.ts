import type {Enemy} from '../objects/Enemy';
import type {HypostasisZone} from '../objects/HypostasisAttack';
import {segmentHitTime} from './collisionGeometry';

export const hypostasisImpactTicks=6;
export const hypostasisAttacksPerExposure=3;
const skillNames={
 'outer-ring':'环形冲击',
 'parallel-sweep':'双线横扫',
 'chain-blast':'连环爆破',
 'cross-strike':'十字冲击',
 'fan-blades':'扇形斩击',
 'scattered-blasts':'散点爆发',
 'double-wave':'内外震荡',
 'cube-pulse':'方块震击',
 'cube-drop':'方块坠击'
} as const;
type HypostasisSkill=keyof typeof skillNames;
export const hypostasisSkills=Object.keys(skillNames) as readonly HypostasisSkill[];

type Point={readonly x:number;readonly y:number};
const circle=(x:number,y:number,radius:number,delay=0):HypostasisZone=>({kind:'circle',x,y,radius,delay});
const ring=(x:number,y:number,innerRadius:number,radius:number,delay=0):HypostasisZone=>({kind:'ring',x,y,innerRadius,radius,delay});
const line=(x:number,y:number,endX:number,endY:number,halfWidth:number):HypostasisZone=>({kind:'line',x,y,endX,endY,halfWidth,delay:0});

function skillZones(skill:HypostasisSkill,boss:Point,target:Point):readonly HypostasisZone[]{
 const angle=Math.atan2(target.y-boss.y,target.x-boss.x);
 const {x,y}=target,angleX=Math.cos(angle),angleY=Math.sin(angle);
 switch(skill){
  case 'outer-ring':return [ring(boss.x,boss.y,80,184)];
  case 'parallel-sweep':return [-8,74].map(offset=>
   line(x-angleY*offset-angleX*420,y+angleX*offset-angleY*420,
    x-angleY*offset+angleX*420,y+angleX*offset+angleY*420,20));
  case 'chain-blast':return [0,80,160].map((distance,index)=>circle(x+angleX*distance,y+angleY*distance,56,index*6));
  case 'cross-strike':return [line(x-380,y,x+380,y,21),line(x,y-300,x,y+300,21)];
  case 'fan-blades':return [-.34,0,.34].map(offset=>
   line(boss.x,boss.y,boss.x+Math.cos(angle+offset)*570,boss.y+Math.sin(angle+offset)*570,15));
  case 'scattered-blasts':return [
   circle(x,y,46),
   ...[0,2*Math.PI/3,4*Math.PI/3].map((offset,index)=>
    circle(x+Math.cos(angle+offset)*78,y+Math.sin(angle+offset)*78,41,(index+1)*4))
  ];
  case 'double-wave':return [circle(boss.x,boss.y,98),ring(boss.x,boss.y,105,204,10)];
  case 'cube-pulse':return [circle(boss.x,boss.y,95)];
  case 'cube-drop':return [circle(x,y,64)];
 }
}

function zoneHits(zone:HypostasisZone,target:Point):boolean{
 const playerRadius=12;
 if(zone.kind==='line')return segmentHitTime(zone.x,zone.y,zone.endX,zone.endY,target.x,target.y,zone.halfWidth+playerRadius)!==null;
 const distance=Math.hypot(target.x-zone.x,target.y-zone.y);
 return distance<=zone.radius+playerRadius&&(zone.kind==='circle'||distance>=zone.innerRadius-playerRadius);
}

export function hypostasisCoreOpen(enemy:Enemy,tick:number):boolean{
 const cue=enemy.hypostasis?.cue;
 return !!cue?.exposesCore&&tick>=cue.endTick&&tick<(enemy.nextAttackTick??Infinity);
}

export function hypostasisDamageFactor(enemy:Enemy,tick:number):number{
 return enemy.hypostasis&&!hypostasisCoreOpen(enemy,tick)?0.25:1;
}

export function stepHypostasis(enemy:Enemy,target:Point,tick:number,seed:number){
 const state=enemy.hypostasis;
 if(!state)return {enemy,damage:0};
 if(tick>=(enemy.nextAttackTick??tick)){
  const skill=hypostasisSkills[(seed>>>0)%hypostasisSkills.length];
  const zones=skillZones(skill,enemy,target);
  const enraged=enemy.hp<=state.maxHp/2;
  const attacks=state.attacks+1;
  const exposesCore=attacks%hypostasisAttacksPerExposure===0;
  const strikeTick=tick+(enraged?19:25);
  const endTick=strikeTick+Math.max(...zones.map(zone=>zone.delay))+hypostasisImpactTicks;
  const restTicks=exposesCore?(enraged?28:40):(enraged?6:10);
  const cue={name:skillNames[skill],zones,startTick:tick,strikeTick,endTick,exposesCore};
  return {enemy:{...enemy,hypostasis:{...state,cue,attacks},nextAttackTick:endTick+restTicks},damage:0};
 }
 const cue=state.cue;
 const hit=cue?.zones.some(zone=>tick===cue.strikeTick+zone.delay&&zoneHits(zone,target));
 return {enemy,damage:hit?enemy.damage:0};
}
