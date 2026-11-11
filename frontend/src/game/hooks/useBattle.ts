import {terrainObstacles} from '../functions/terrainObstacles';
import {applyWeaponStats} from '../functions/weaponStats';
import type {RunStart} from '../../objects/Profile';
import { useEffect,useReducer,useState } from 'react';
import {characterStats} from '../functions/characterStats';
import { initialBattle,stepBattle } from '../functions/stepBattle';
export function useBattle(run:RunStart){
 const [state,dispatch]=useReducer(stepBattle,run,({seed,character,equippedWeapon,level,stage,adventure,map})=>{
  const stats=applyWeaponStats({...characterStats(character,level),attackRange:character.attackRange,attackIntervalTicks:character.attackIntervalTicks},equippedWeapon);
  const endless=map.layout==='endless';
  const worldSeed=endless?seed:map.seed;
  const collisionChunkX=endless?1:0;
  const stageMora=stage?.rewards.reduce((sum,reward)=>reward.kind==='currency'&&reward.currency==='mora'?sum+reward.amount:sum,0)??null;
  return {...initialBattle(seed),phase:'countdown' as const,countdownTicks:60,targetEnemies:stage?.enemies??null,stageMora,adventure,worldSeed,
   terrainCollision:true,terrainRuins:map.includeRuins,collisionChunkX,collisionChunkY:0,obstacles:terrainObstacles(worldSeed,endless,collisionChunkX,0,map.includeRuins),
   attackPattern:character.attackPattern,attackRange:stats.attackRange,attackIntervalTicks:stats.attackIntervalTicks,attackStyle:character.attackStyle,
   power:stats.attack,hp:stats.maxHp,maxHp:stats.maxHp,weaponTalent:equippedWeapon?.definition.talent??null};
 }),[keys,setKeys]=useState<readonly string[]>([]);
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setKeys([]);dispatch({kind:'pause'});return;}if(e.key.startsWith('Arrow'))e.preventDefault();setKeys(k=>k.includes(e.key)?k:[...k,e.key]);},up=(e:KeyboardEvent)=>setKeys(k=>k.filter(v=>v!==e.key)),blur=()=>{setKeys([]);dispatch({kind:'pause'});};
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
 return ()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};},[]);
 useEffect(()=>{const timer=window.setInterval(()=>dispatch({kind:'tick',keys}),50);return ()=>window.clearInterval(timer);},[keys]);
 const pause=()=>{setKeys([]);dispatch({kind:'pause'});};
 const resume=()=>{setKeys([]);dispatch({kind:'resume'});};
 return {state,dispatch,pause,resume};
}
