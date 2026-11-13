import type {Enemy} from '../objects/BattleState';
import type {LootParticle} from '../objects/LootParticle';
import {enemyDefinitions} from '../objects/Enemy';
import {beginnerArtifacts} from '../../objects/Artifact';
import {mapHash} from './generateMap';

export function createArtifactLoot(enemies:readonly Enemy[],seed:number){
 return enemies.filter(enemy=>enemy.kind==='elite').map(enemy=>{
  const definition=beginnerArtifacts[mapHash(seed,enemy.id,0,1747)%beginnerArtifacts.length];
  return {id:`${enemy.id}:artifact`,kind:'artifact',artifactId:definition.id,x:enemy.x,y:enemy.y,vx:0,vy:-4,phase:'scatter',age:0} as const;
 });
}
export function createEnemyLoot(enemies:readonly Enemy[],killsBefore:number,targetEnemies:number|null,stageMora:number|null,adventureMoraPerKill=10):readonly LootParticle[]{
 return enemies.flatMap((enemy,index)=>{
  const mora=targetEnemies!==null&&stageMora!==null?Math.floor((killsBefore+index+1)*stageMora/targetEnemies)-Math.floor((killsBefore+index)*stageMora/targetEnemies):adventureMoraPerKill;
  return ([{kind:'experience',value:enemyDefinitions[enemy.kind].experience},{kind:'mora',value:mora}] as const).flatMap(({kind,value})=>{
   const count=Math.min(3,value);
   return Array.from({length:count},(_,i)=>{
    const angle=((enemy.id*137+i*113+(kind==='mora'?47:0))%360)*Math.PI/180,speed=3+(i%2)*2;
    return {id:enemy.id+':'+kind+':'+i,kind,value:Math.floor((i+1)*value/count)-Math.floor(i*value/count),x:enemy.x,y:enemy.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,phase:'scatter' as const,age:0};
   });
  });
 });
}
function advanceLootParticle(p:LootParticle,x:number,y:number):LootParticle|null {
 if(p.phase==='absorbed')return p.age>=5?null:{...p,x,y,age:p.age+1};
 if(p.phase==='scatter')return {...p,x:p.x+p.vx,y:p.y+p.vy,vx:p.vx*.72,vy:p.vy*.72,age:p.age+1,phase:p.age>=5?'attract':'scatter'};
 const dx=x-p.x,dy=y-p.y,distance=Math.hypot(dx,dy);
 if(distance<=12||p.age>=35)return {...p,x,y,age:0,phase:'absorbed'};
 const scale=Math.min(distance,18+p.age*2)/distance;
 return {...p,x:p.x+dx*scale,y:p.y+dy*scale,age:p.age+1};
}
export function stepLoot(particles:readonly LootParticle[],x:number,y:number):{readonly particles:readonly LootParticle[];readonly experience:number;readonly mora:number}{
 const advanced=particles.map(p=>advanceLootParticle(p,x,y));
 const collected=advanced.filter((p,i):p is LootParticle=>p!==null&&p.phase==='absorbed'&&particles[i].phase!=='absorbed');
 return {
  particles:advanced.filter((p):p is LootParticle=>p!==null),
  experience:collected.filter(p=>p.kind==='experience').reduce((sum,p)=>sum+p.value,0),
  mora:collected.filter(p=>p.kind==='mora').reduce((sum,p)=>sum+p.value,0)
 };
}
