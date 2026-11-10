import {enemyDefinitions,type Enemy,type EnemyProjectile} from '../objects/Enemy';
import type {WorldBounds} from '../objects/WorldObstacle';
import {moveEnemyAroundObstacle,moveWithCollision,obstacleHitTime,segmentHitTime} from './collisionGeometry';
import type {CollisionTerrain} from './obstacleIndex';

export const enemyWindupTicks=3;

export function moveBattleEnemy(enemy:Enemy,x:number,y:number,terrain:CollisionTerrain,bounds:WorldBounds|null):Enemy{
 const {radius,attack}=enemyDefinitions[enemy.kind];
 if(attack.kind==='ranged'){
  const dx=enemy.x-x,dy=enemy.y-y,distance=Math.hypot(dx,dy);
  if(distance<attack.standOff*.72){
   const angle=distance===0?(enemy.id%2===0?0:Math.PI):Math.atan2(dy,dx);
   return {...enemy,...moveWithCollision(enemy.x,enemy.y,Math.cos(angle)*1.7,Math.sin(angle)*1.7,radius,terrain,bounds)};
  }
  if(distance<=attack.standOff&&obstacleHitTime(enemy.x,enemy.y,x,y,attack.radius,terrain)===Infinity)return enemy;
 }
 return {...enemy,...moveEnemyAroundObstacle(enemy.id,enemy.x,enemy.y,x,y,radius,terrain,bounds)};
}

export function resolveEnemyAttacks(enemies:readonly Enemy[],inFlight:readonly EnemyProjectile[],x:number,y:number,tick:number,terrain:CollisionTerrain){
 const projectiles:EnemyProjectile[]=[];
 let damage=0,hitAngle=0,strongestHit=0;
 const recordHit=(amount:number,angle:number)=>{
  damage+=amount;
  if(amount>strongestHit){strongestHit=amount;hitAngle=angle;}
 };
 for(const shot of inFlight){
  const speed=Math.hypot(shot.dx,shot.dy),distance=Math.min(speed,shot.remainingRange);
  const endX=shot.x+shot.dx*distance/speed,endY=shot.y+shot.dy*distance/speed;
  const wall=obstacleHitTime(shot.x,shot.y,endX,endY,shot.radius,terrain);
  const impact=segmentHitTime(shot.x,shot.y,endX,endY,x,y,12+shot.radius);
  if(impact!==null&&impact<wall){recordHit(shot.damage,Math.atan2(shot.dy,shot.dx));continue;}
  if(wall===Infinity&&shot.remainingRange>distance)projectiles.push({...shot,x:endX,y:endY,remainingRange:shot.remainingRange-distance});
 }
 const updated=enemies.map(enemy=>{
  const {attack}=enemyDefinitions[enemy.kind];
  const dx=x-enemy.x,dy=y-enemy.y,distance=Math.hypot(dx,dy);
  const attackTick=attack.kind==='contact'?Math.ceil(tick/10)*10:Math.max(tick,enemy.nextAttackTick??tick);
  const inRange=attack.kind==='contact'?distance<attack.reach:distance>0&&distance<=attack.range;
  if(attackTick-tick>enemyWindupTicks||!inRange||
   attack.kind==='ranged'&&obstacleHitTime(enemy.x,enemy.y,x,y,attack.radius,terrain)!==Infinity){
   return enemy.attackCue&&enemy.attackCue.tick>=tick?{...enemy,attackCue:undefined}:enemy;
  }
  const angle=Math.atan2(dy,dx);
  const aiming={...enemy,attackCue:{tick:attackTick,angle}};
  if(attackTick>tick)return aiming;
  if(attack.kind==='contact'){recordHit(enemy.damage,angle);return aiming;}
  projectiles.push({id:enemy.id,kind:attack.projectile,x:enemy.x,y:enemy.y,dx:dx/distance*attack.speed,dy:dy/distance*attack.speed,
   remainingRange:attack.range,radius:attack.radius,damage:enemy.damage});
  return {...aiming,nextAttackTick:tick+attack.cooldown};
 });
 return {enemies:updated,projectiles,damage,hitAngle};
}
