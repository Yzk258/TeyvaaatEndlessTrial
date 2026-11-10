import {canMove,obstacleHitTime,segmentHitTime} from './collisionGeometry';
import type {CollisionTerrain} from './obstacleIndex';
import {enemyDefinitions} from '../objects/Enemy';
export {segmentHitTime} from './collisionGeometry';
import type {BattleState,Enemy} from '../objects/BattleState';
import type {AttackResolution} from '../objects/AttackResolution';
import type {Projectile} from '../objects/Projectile';
import {weaponDamage} from './weaponStats';
export function nearestTarget(enemies:readonly Enemy[],x:number,y:number,range:number):Enemy|undefined {
 return enemies.filter(e=>e.hp>0&&Math.hypot(e.x-x,e.y-y)<=range).reduce<Enemy|undefined>((best,e)=>!best||Math.hypot(e.x-x,e.y-y)<Math.hypot(best.x-x,best.y-y)?e:best,undefined);
}
export function isInArc(x:number,y:number,originX:number,originY:number,angle:number,range:number,angleDegrees:number):boolean {
 const dx=x-originX,dy=y-originY;
 return Math.hypot(dx,dy)<=range&&(dx===0&&dy===0||Math.cos(Math.atan2(dy,dx)-angle)>=Math.cos(angleDegrees*Math.PI/360)-1e-9);
}
export function resolveAttacks(s:BattleState,enemies:readonly Enemy[],x:number,y:number,facing:number,tick:number,terrain:CollisionTerrain=s.obstacles):AttackResolution {
 const pattern=s.attackPattern;
 const due=s.queuedAttackTicks.filter(dueTick=>dueTick<=tick).length;
 const ready=tick%s.attackIntervalTicks===0;
 const target=ready||due>0?nearestTarget(
  pattern.kind==='area'?enemies:enemies.filter(e=>e.hp>0&&Math.hypot(e.x-x,e.y-y)<=s.attackRange&&canMove(x,y,e.x,e.y,0,terrain)),
  x,y,s.attackRange
 ):undefined;
 const primary=ready&&!!target;
 const shots=target?Number(primary)+due:0,fire=shots>0;
 const queuedAttackTicks=[...s.queuedAttackTicks.filter(dueTick=>dueTick>tick),...(primary?Array.from({length:s.extraAttacks},(_,i)=>tick+(i+1)*3):[])];
 const effects=s.effects.filter(e=>e.life>1).map(e=>({...e,life:e.life-1}));
 const attackAngle=target?Math.atan2(target.y-y,target.x-x):facing;
 const instant=(()=>{
  if(!fire||pattern.kind==='projectile')return {enemies,effects};
  switch(pattern.kind){
   case 'meleeArc':return {
    enemies:enemies.map(e=>isInArc(e.x,e.y,x,y,attackAngle,s.attackRange,pattern.angleDegrees)&&canMove(x,y,e.x,e.y,0,terrain)?{...e,hp:e.hp-weaponDamage(s.power,s.weaponTalent,Math.hypot(e.x-x,e.y-y),false)*shots}:e),
    effects:[...effects,{kind:'meleeArc' as const,id:tick,x,y,angle:attackAngle,angleDegrees:pattern.angleDegrees,radius:s.attackRange,life:6}]
   };
   case 'area':return {
    enemies:enemies.map(e=>Math.hypot(e.x-target!.x,e.y-target!.y)<=pattern.splashRadius?{...e,hp:e.hp-weaponDamage(s.power,s.weaponTalent,Math.hypot(e.x-x,e.y-y),false)*shots}:e),
    effects:[...effects,{kind:'area' as const,id:tick,x:target!.x,y:target!.y,radius:pattern.splashRadius,life:6}]
   };
  }
 })();
 const launched:readonly Projectile[]=fire&&pattern.kind==='projectile'?Array.from({length:shots},(_,i)=>({
  id:tick*16+i,x,y,originX:x,originY:y,dx:Math.cos(attackAngle)*pattern.speed,dy:Math.sin(attackAngle)*pattern.speed,
  remainingRange:s.attackRange,radius:pattern.radius,remainingHits:1+pattern.pierce,hitIds:[],damage:s.power,talent:s.weaponTalent
 })):[];
 const resolved=[...s.projectiles,...launched].reduce<AttackResolution>((result,p)=>{
  const speed=Math.hypot(p.dx,p.dy),distance=Math.min(speed,p.remainingRange),scale=distance/speed,endX=p.x+p.dx*scale,endY=p.y+p.dy*scale;
  const wallTime=obstacleHitTime(p.x,p.y,endX,endY,p.radius,terrain);
  const intersections=result.enemies.filter(e=>e.hp>0&&!p.hitIds.includes(e.id)).flatMap(e=>{
   const t=segmentHitTime(p.x,p.y,endX,endY,e.x,e.y,p.radius+enemyDefinitions[e.kind].radius);
   return t===null||t>=wallTime?[]:[{id:e.id,t}];
  }).toSorted((a,b)=>a.t-b.t||a.id-b.id).slice(0,p.remainingHits);
  const hits=intersections.map(h=>h.id);
  const updated=result.enemies.map(e=>{const hit=intersections.find(h=>h.id===e.id);return hit?{...e,hp:e.hp-weaponDamage(p.damage,p.talent,Math.hypot(p.x+(endX-p.x)*hit.t-p.originX,p.y+(endY-p.y)*hit.t-p.originY),false)}:e;});
  const remainingRange=p.remainingRange-distance,remainingHits=p.remainingHits-hits.length;
  return {...result,enemies:updated,projectiles:wallTime===Infinity&&remainingRange>0&&remainingHits>0?[...result.projectiles,{...p,x:endX,y:endY,remainingRange,remainingHits,hitIds:[...p.hitIds,...hits]}]:result.projectiles};
 },{queuedAttackTicks,enemies:instant.enemies,projectiles:[],effects:instant.effects,hits:[],attackCue:fire?{tick,x,y,angle:attackAngle}:s.attackCue});
 const previous=Object.fromEntries(enemies.map(e=>[e.id,e]));
 const hits=resolved.enemies.flatMap(e=>{
  const damage=(previous[e.id]?.hp??e.hp)-e.hp;
  return damage>0?[{id:tick+':'+e.id,enemyId:e.id,enemyKind:e.kind,x:e.x,y:e.y,angle:Math.atan2(e.y-y,e.x-x),damage,defeated:e.hp<=0,life:10}]:[];
 });
 return {...resolved,hits:[...s.hits.filter(h=>h.life>1).map(h=>({...h,life:h.life-1})),...hits].slice(-128)};
}
