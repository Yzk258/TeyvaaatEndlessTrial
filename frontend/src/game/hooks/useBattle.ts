import {terrainObstacles} from '../functions/terrainObstacles';
import {equippedCharacterStats} from '../functions/artifactStats';
import type {RunStart} from '../../objects/Profile';
import { useEffect,useReducer,useRef } from 'react';
import { initialBattle,stepBattle } from '../functions/stepBattle';
export function useBattle(run:RunStart){
 const [state,dispatch]=useReducer(stepBattle,run,current=>{
  const {seed,character,equippedWeapon,equippedArtifacts,level,stage,adventure,map}=current;
  const stats=equippedCharacterStats(character,level,equippedWeapon,equippedArtifacts);
  const endless=map.layout==='endless';
  const worldSeed=endless?seed:map.seed;
  const collisionChunkX=endless?1:0;
  const stageMora=stage?.rewards.reduce((sum,reward)=>reward.kind==='currency'&&reward.currency==='mora'?sum+reward.amount:sum,0)??null;
  return {...initialBattle(seed),phase:'countdown' as const,countdownTicks:60,targetEnemies:stage?.enemies??null,stageMora,adventure,worldSeed,
   bossElement:stage?.category==='crystals'?stage.boss:null,
   stageDifficulty:current.stage===null?null:current.stageDifficulty,
   terrainCollision:true,terrainRuins:map.includeRuins,collisionChunkX,collisionChunkY:0,obstacles:terrainObstacles(worldSeed,endless,collisionChunkX,0,map.includeRuins),
   attackPattern:character.attackPattern,attackRange:stats.attackRange,attackIntervalTicks:stats.attackIntervalTicks,attackStyle:character.attackStyle,
   power:stats.attack,hp:stats.maxHp,maxHp:stats.maxHp,healOnKillPercent:stats.healOnKillPercent,weaponTalent:equippedWeapon?.definition.talent??null};
 });
 const keys=useRef<readonly string[]>([]);
 useEffect(()=>{
  const down=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){
    event.preventDefault();
    keys.current=[];
    dispatch({kind:'pause'});
    return;
   }
   if(event.key.startsWith('Arrow'))event.preventDefault();
   if(!keys.current.includes(event.key))keys.current=[...keys.current,event.key];
  };
  const up=(event:KeyboardEvent)=>{keys.current=keys.current.filter(key=>key!==event.key);};
  const blur=()=>{keys.current=[];dispatch({kind:'pause'});};
  window.addEventListener('keydown',down);
  window.addEventListener('keyup',up);
  window.addEventListener('blur',blur);
  return ()=>{
   window.removeEventListener('keydown',down);
   window.removeEventListener('keyup',up);
   window.removeEventListener('blur',blur);
  };
 },[]);
 useEffect(()=>{
  const timer=window.setInterval(()=>dispatch({kind:'tick',keys:keys.current}),50);
  return ()=>window.clearInterval(timer);
 },[]);
 const pause=()=>{keys.current=[];dispatch({kind:'pause'});};
 const resume=()=>{keys.current=[];dispatch({kind:'resume'});};
 return {state,dispatch,pause,resume};
}
