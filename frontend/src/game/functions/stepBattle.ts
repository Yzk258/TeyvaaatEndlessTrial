import {adventureComplete} from './adventureProgress';
import {CHUNK_SIZE} from './generateMap';
import {terrainObstacles} from './terrainObstacles';
import {moveWithCollision} from './collisionGeometry';
import {indexObstacles} from './obstacleIndex';
import {resolveAttacks} from './resolveAttacks';
import {createEnemyLoot,stepLoot} from './battleLoot';
import {spawnBattleEnemies} from './spawnBattleEnemies';
import {moveBattleEnemy,resolveEnemyAttacks} from './enemyAttacks';
import {applyUpgradeStats,rollUpgradeChoices} from './battleUpgrades';
import {playerHitTicks,type PlayerHitEffect} from '../objects/HitEffect';
import type {BattleAction,BattleState} from '../objects/BattleState';
export const initialBattle=(seed:number):BattleState=>({
 adventure:null,combatTicks:0,loot:[],collectedMora:0,stageMora:null,moveSpeed:6,extraAttacks:0,queuedAttackTicks:[],upgradeSeed:(seed^0x9e3779b9)>>>0,upgradeChoices:[],
 motion:{moving:false,distance:0},attackCue:null,hits:[],playerHits:[],obstacles:[],collisionChunkX:1,collisionChunkY:0,terrainCollision:false,
 attackPattern:{kind:'area',splashRadius:105},projectiles:[],enemyProjectiles:[],lastEliteWave:0,effects:[],facing:0,countdownTicks:0,weaponTalent:null,attackRange:105,attackIntervalTicks:12,attackStyle:'melee',
 phase:'fighting',targetEnemies:null,tick:0,x:450,y:270,hp:100,maxHp:100,experience:0,pendingUpgrades:0,kills:0,level:1,power:2,enemies:[],worldSeed:seed,seed
});
const recentPlayerHits=(hits:readonly PlayerHitEffect[],tick:number)=>hits.filter(hit=>tick-hit.tick<playerHitTicks);
export const experienceRequired=(level:number):number=>30+15*(level-1);
export function gainExperience(level:number,experience:number,gained:number):{level:number;experience:number;upgrades:number}{
 const total=experience+gained,required=experienceRequired(level);
 if(total<required)return {level,experience:total,upgrades:0};
 const next=gainExperience(level+1,total-required,0);
 return {...next,upgrades:next.upgrades+1};
}
export function stepBattle(s:BattleState,a:BattleAction):BattleState {
 if(a.kind==='pause')return s.phase==='countdown'||s.phase==='fighting'||s.phase==='upgrade'||s.phase==='collecting'?{...s,phase:'paused'}:s;
 if(a.kind==='resume')return s.phase==='paused'?{...s,phase:s.countdownTicks>0?'countdown':s.hp<=0||adventureComplete(s.adventure,s.combatTicks)||s.targetEnemies!==null&&s.kills>=s.targetEnemies?'collecting':s.pendingUpgrades>0?'upgrade':'fighting'}:s;
 if(a.kind==='upgrade'){
  if(s.phase!=='upgrade'||!s.upgradeChoices.includes(a.choice))return s;
  const upgraded={...applyUpgradeStats(s,a.choice),pendingUpgrades:Math.max(0,s.pendingUpgrades-1)};
  if(upgraded.pendingUpgrades===0)return {...upgraded,phase:'fighting',upgradeChoices:[]};
  const offered=rollUpgradeChoices(upgraded);
  return {...upgraded,upgradeChoices:offered.choices,upgradeSeed:offered.seed};
 }
 if(s.phase==='countdown'){
  const remaining=Math.max(0,s.countdownTicks-1);
  return {...s,countdownTicks:remaining,phase:remaining===0?'fighting':'countdown'};
 }
 if(s.phase==='collecting'){
  const loot=stepLoot(s.loot,s.x,s.y),progress=gainExperience(s.level,s.experience,loot.experience);
  return {...s,tick:s.tick+1,loot:loot.particles,collectedMora:s.collectedMora+loot.mora,level:progress.level,experience:progress.experience,pendingUpgrades:0,upgradeChoices:[],motion:{...s.motion,moving:false},effects:s.effects.filter(e=>e.life>1).map(e=>({...e,life:e.life-1})),hits:s.hits.filter(h=>h.life>1).map(h=>({...h,life:h.life-1})),playerHits:recentPlayerHits(s.playerHits??[],s.tick+1),phase:loot.particles.length===0?'ended':'collecting'};
 }
 if(s.phase!=='fighting')return s;
 const combatTicks=s.combatTicks+1,tick=s.tick+1,dx=Number(a.keys.includes('d')||a.keys.includes('ArrowRight'))-Number(a.keys.includes('a')||a.keys.includes('ArrowLeft')),dy=Number(a.keys.includes('s')||a.keys.includes('ArrowDown'))-Number(a.keys.includes('w')||a.keys.includes('ArrowUp')),norm=Math.hypot(dx,dy)||1;
 const adventure=s.targetEnemies===null;
 const bounds=adventure?null:{minX:20,minY:20,maxX:880,maxY:520};
 const previousIndex=s.obstacleIndex?.source===s.obstacles?s.obstacleIndex:s.terrainCollision?indexObstacles(s.obstacles):undefined;
 const position=moveWithCollision(s.x,s.y,dx/norm*s.moveSpeed,dy/norm*s.moveSpeed,12,previousIndex??s.obstacles,bounds),x=position.x,y=position.y;
 const traveled=Math.hypot(x-s.x,y-s.y),motion={moving:traveled>0.001,distance:s.motion.distance+traveled};
 const collisionChunkX=adventure?Math.floor(x/CHUNK_SIZE):0,collisionChunkY=adventure?Math.floor(y/CHUNK_SIZE):0;
 const obstacles=s.terrainCollision&&(collisionChunkX!==s.collisionChunkX||collisionChunkY!==s.collisionChunkY)?terrainObstacles(s.worldSeed,adventure,collisionChunkX,collisionChunkY):s.obstacles;
 const obstacleIndex=obstacles===s.obstacles?previousIndex:indexObstacles(obstacles);
 const terrain=obstacleIndex??obstacles;
 const seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;
 const nearby=s.enemies.filter(e=>!adventure||Math.hypot(e.x-x,e.y-y)<1400);
 const spawned=spawnBattleEnemies(s,nearby,x,y,seed,terrain);
 const facing=dx!==0||dy!==0?Math.atan2(dy,dx):s.facing;
 const enemyBounds=adventure?null:{minX:24,minY:24,maxX:876,maxY:516};
 const candidates=spawned.enemies.map(e=>moveBattleEnemy(e,x,y,terrain,enemyBounds));
 const resolved=resolveAttacks(s,candidates,x,y,facing,tick,terrain);
 const defeated=resolved.enemies.filter(e=>e.hp<=0);
 const loot=stepLoot([...s.loot,...createEnemyLoot(defeated,s.kills,s.targetEnemies,s.stageMora,s.adventure?.rules.moraPerKill??10)],x,y);
 const progress=gainExperience(s.level,s.experience,loot.experience);
 const enemyAttacks=resolveEnemyAttacks(resolved.enemies.filter(e=>e.hp>0),s.enemyProjectiles??[],x,y,tick,terrain);
 const kills=s.kills+defeated.length,hp=Math.max(0,s.hp-enemyAttacks.damage);
 const playerHits=recentPlayerHits(s.playerHits??[],tick);
 if(hp<s.hp)playerHits.push({tick,x,y,angle:enemyAttacks.hitAngle,damage:s.hp-hp});
 const terminal=hp<=0||adventureComplete(s.adventure,combatTicks)||s.targetEnemies!==null&&kills>=s.targetEnemies;
 const next:BattleState={...s,motion,attackCue:resolved.attackCue,hits:resolved.hits,playerHits,obstacles,obstacleIndex,collisionChunkX,collisionChunkY,combatTicks,tick,x,y,facing,
  projectiles:terminal?[]:resolved.projectiles,enemyProjectiles:terminal?[]:enemyAttacks.projectiles,lastEliteWave:spawned.lastEliteWave,
  queuedAttackTicks:terminal?[]:resolved.queuedAttackTicks,effects:resolved.effects,hp,kills,enemies:enemyAttacks.enemies,seed,
  loot:loot.particles,collectedMora:s.collectedMora+loot.mora,level:progress.level,experience:progress.experience,
  pendingUpgrades:terminal?0:s.pendingUpgrades+progress.upgrades,
  phase:terminal?(loot.particles.length>0?'collecting':'ended'):'fighting'
 };
 if(!terminal&&next.pendingUpgrades>0){
  const offered=rollUpgradeChoices(next);
  return {...next,phase:'upgrade',upgradeChoices:offered.choices,upgradeSeed:offered.seed};
 }
 return next;
}
