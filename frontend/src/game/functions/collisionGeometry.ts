import type {WorldObstacle,WorldBounds} from '../objects/WorldObstacle';
import {obstaclesAlong,type CollisionTerrain} from './obstacleIndex';
export function segmentHitTime(x:number,y:number,endX:number,endY:number,cx:number,cy:number,radius:number):number|null {
 const vx=endX-x,vy=endY-y,ox=x-cx,oy=y-cy,a=vx*vx+vy*vy,c=ox*ox+oy*oy-radius*radius;
 if(c<=0)return 0;
 if(a===0)return null;
 const b=2*(ox*vx+oy*vy),disc=b*b-4*a*c;
 if(disc<0)return null;
 const t=(-b-Math.sqrt(disc))/(2*a);
 return t>=0&&t<=1?t:null;
}
export function obstacleHitTime(x:number,y:number,endX:number,endY:number,radius:number,terrain:CollisionTerrain):number{
 return obstaclesAlong(terrain,x,y,endX,endY,radius).reduce((earliest,o)=>{
  const hit=segmentHitTime(x,y,endX,endY,o.x,o.y,radius+o.radius);
  return hit===null?earliest:Math.min(earliest,hit);
 },Infinity);
}
export function canStand(x:number,y:number,radius:number,terrain:CollisionTerrain,bounds:WorldBounds|null):boolean {
 return (!bounds||(x>=bounds.minX&&x<=bounds.maxX&&y>=bounds.minY&&y<=bounds.maxY))&&
 obstaclesAlong(terrain,x,y,x,y,radius).every(o=>Math.abs(x-o.x)>radius+o.radius||Math.abs(y-o.y)>radius+o.radius||Math.hypot(x-o.x,y-o.y)>=radius+o.radius-1e-6);
}
export function canMove(x:number,y:number,endX:number,endY:number,radius:number,terrain:CollisionTerrain):boolean {
 return obstaclesAlong(terrain,x,y,endX,endY,radius).every(o=>{
  const expanded=o.radius+radius;
  if(o.x<Math.min(x,endX)-expanded||o.x>Math.max(x,endX)+expanded||o.y<Math.min(y,endY)-expanded||o.y>Math.max(y,endY)+expanded)return true;
  const startDistance=Math.hypot(x-o.x,y-o.y);
  if(startDistance<expanded+1e-6)return Math.hypot(endX-o.x,endY-o.y)>startDistance+1e-6;
  return segmentHitTime(x,y,endX,endY,o.x,o.y,expanded)===null;
 });
}
export function moveWithCollision(x:number,y:number,dx:number,dy:number,radius:number,terrain:CollisionTerrain,bounds:WorldBounds|null):{x:number;y:number} {
 const endX=bounds?Math.max(bounds.minX,Math.min(bounds.maxX,x+dx)):x+dx;
 const endY=bounds?Math.max(bounds.minY,Math.min(bounds.maxY,y+dy)):y+dy;
 if((endX===x&&endY===y)||canMove(x,y,endX,endY,radius,terrain))return {x:endX,y:endY};
 const slideX=canMove(x,y,endX,y,radius,terrain)?endX:x;
 const slideY=canMove(slideX,y,slideX,endY,radius,terrain)?endY:y;
 return {x:slideX,y:slideY};
}
const spawnOffsets=Array.from({length:192},(_,i)=>{
 const angle=(i%16)*Math.PI/8,distance=(1+Math.floor(i/16))*30;
 return {x:Math.cos(angle)*distance,y:Math.sin(angle)*distance};
});
export function findSpawnPoint(x:number,y:number,radius:number,terrain:CollisionTerrain,bounds:WorldBounds|null):{x:number;y:number}|undefined {
 if(canStand(x,y,radius,terrain,bounds))return {x,y};
 const offset=spawnOffsets.find(p=>canStand(x+p.x,y+p.y,radius,terrain,bounds));
 return offset?{x:x+offset.x,y:y+offset.y}:undefined;
}
export function moveEnemyAroundObstacle(id:number,x:number,y:number,targetX:number,targetY:number,radius:number,terrain:CollisionTerrain,bounds:WorldBounds|null):{x:number;y:number} {
 const dx=targetX-x,dy=targetY-y,distance=Math.hypot(dx,dy);
 if(distance===0)return {x,y};
 // Only obstacles ahead can affect navigation; all terrain still shares one geometry source.
 const minX=Math.min(x,targetX),maxX=Math.max(x,targetX),minY=Math.min(y,targetY),maxY=Math.max(y,targetY);
 const blocking=obstaclesAlong(terrain,x,y,targetX,targetY,radius).reduce<{obstacle:WorldObstacle;t:number}|undefined>((best,o)=>{
  const reach=o.radius+radius;
  if(best?.t===0||o.x<minX-reach||o.x>maxX+reach||o.y<minY-reach||o.y>maxY+reach)return best;
  const t=segmentHitTime(x,y,targetX,targetY,o.x,o.y,reach+2);
  return t!==null&&(!best||t<best.t)?{obstacle:o,t}:best;
 },undefined)?.obstacle;
 const waypoint=(()=>{
  if(!blocking)return {x:targetX,y:targetY};
  const safeRadius=blocking.radius+radius+3,d=Math.hypot(x-blocking.x,y-blocking.y);
  const angle=Math.atan2(y-blocking.y,x-blocking.x)+(id%2===0?1:-1)*Math.max(.18,Math.acos(Math.min(1,safeRadius/Math.max(d,safeRadius)))*.85);
  return {x:blocking.x+Math.cos(angle)*safeRadius,y:blocking.y+Math.sin(angle)*safeRadius};
 })();
 const length=Math.hypot(waypoint.x-x,waypoint.y-y)||1,speed=Math.min(1.7,length);
 return moveWithCollision(x,y,(waypoint.x-x)/length*speed,(waypoint.y-y)/length*speed,radius,terrain,bounds);
}
