import {enemyDefinitions,type Enemy,type EnemyKind} from '../objects/Enemy';
import type {BattleState} from '../objects/BattleState';
import {adventureDifficulty,eliteWaveInterval} from './adventureProgress';
import {findSpawnPoint} from './collisionGeometry';
import type {CollisionTerrain} from './obstacleIndex';

const ordinaryKinds=['hilichurl','shooter','samachurl','abyssMage','whopperflower'] as const;

export function spawnBattleEnemies(s:BattleState,nearby:readonly Enemy[],x:number,y:number,seed:number,terrain:CollisionTerrain){
 const tick=s.tick+1,combatTicks=s.combatTicks+1,adventure=s.targetEnemies===null;
 const difficulty=s.adventure?adventureDifficulty(s.adventure,combatTicks):{wave:1,health:1,damage:1,interval:12,count:1,limit:160};
 const spawnClock=s.adventure?combatTicks:tick;
 const bounds=adventure?null:{minX:24,minY:24,maxX:876,maxY:516};
 const spawn=(kind:EnemyKind,id:number,startX:number,startY:number):Enemy|undefined=>{
  const definition=enemyDefinitions[kind];
  const point=findSpawnPoint(startX,startY,definition.radius,terrain,bounds);
  if(!point)return undefined;
  return {id,...point,kind,hp:Math.ceil(definition.hp*difficulty.health),damage:Math.ceil(definition.damage*difficulty.damage),
   ...(definition.attack.kind==='ranged'?{nextAttackTick:tick+8+id%11}:{})};
 };
 const lastEliteWave=s.lastEliteWave??0;
 const eliteWave=lastEliteWave+eliteWaveInterval;
 const eliteDue=adventure&&s.adventure?.settings.mode==='endless'&&difficulty.wave>=eliteWave;
 // Reserve a place for the elite even when the ordinary enemy cap has already been reached.
 const displaced=eliteDue&&nearby.length>=difficulty.limit?nearby.findLastIndex(e=>e.kind!=='elite'):-1;
 const elite=eliteDue&&(nearby.length<difficulty.limit||displaced>=0)?spawn('elite',tick*16+14,x+360,y-140):undefined;
 const present=elite&&displaced>=0?nearby.filter((_,i)=>i!==displaced):nearby;
 const remaining=adventure?difficulty.limit-present.length-Number(!!elite):s.targetEnemies!-s.kills-present.length;
 const count=spawnClock%difficulty.interval===0?Math.max(0,Math.min(difficulty.count,remaining)):0;
 const angle=(seed%6283)/1000;
 const fresh:Enemy[]=[];
 for(let i=0;i<count;i++){
  const kind=tick%36===0?ordinaryKinds[(tick/36-1+i)%ordinaryKinds.length]:'slime';
  const direction=angle+i*2.39996;
  const enemy=spawn(kind,tick*16+i,adventure?x+Math.cos(direction)*570:seed%2===0?10:890,
   adventure?y+Math.sin(direction)*570:20+seed%500);
  if(enemy)fresh.push(enemy);
 }
 if(adventure&&!elite&&spawnClock%1800===0&&present.length+fresh.length<difficulty.limit){
  const brute=spawn('boss',tick*16+15,x+500,y-280);
  if(brute)fresh.push(brute);
 }
 return {enemies:elite?[...present,...fresh,elite]:[...present,...fresh],lastEliteWave:elite?eliteWave:lastEliteWave};
}
