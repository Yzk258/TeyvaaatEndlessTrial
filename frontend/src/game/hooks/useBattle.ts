import type {AdventurePlan} from '../../objects/AdventurePlan';
import {terrainObstacles} from '../functions/terrainObstacles';
import type {WeaponLoadout} from '../../objects/Weapon';
import {applyWeaponStats} from '../functions/weaponStats';
import type {Character} from '../../objects/Character';
import { useEffect,useReducer,useState } from 'react';
import {characterStats} from '../functions/characterStats';
import { initialBattle,stepBattle } from '../functions/stepBattle';
export function useBattle(seed:number,character:Character,equippedWeapon:WeaponLoadout|null,characterLevel:number,targetEnemies:number|null,stageMora:number|null=null,adventure:AdventurePlan|null=null){
 const [state,dispatch]=useReducer(stepBattle,seed,s=>{
 const stats=applyWeaponStats({...characterStats(character,characterLevel),attackRange:character.attackRange,attackIntervalTicks:character.attackIntervalTicks},equippedWeapon);
 return {...initialBattle(s),phase:'countdown' as const,countdownTicks:60,targetEnemies,stageMora,adventure,terrainCollision:true,collisionChunkX:targetEnemies===null?1:0,collisionChunkY:0,obstacles:terrainObstacles(s,targetEnemies===null,targetEnemies===null?1:0,0),attackPattern:character.attackPattern,attackRange:stats.attackRange,attackIntervalTicks:stats.attackIntervalTicks,attackStyle:character.attackStyle,power:stats.attack,hp:stats.maxHp,maxHp:stats.maxHp,weaponTalent:equippedWeapon?.definition.talent??null};
 }),[keys,setKeys]=useState<readonly string[]>([]);
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setKeys([]);dispatch({kind:'pause'});return;}if(e.key.startsWith('Arrow'))e.preventDefault();setKeys(k=>k.includes(e.key)?k:[...k,e.key]);},up=(e:KeyboardEvent)=>setKeys(k=>k.filter(v=>v!==e.key)),blur=()=>{setKeys([]);dispatch({kind:'pause'});};
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
 return ()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};},[]);
 useEffect(()=>{const timer=window.setInterval(()=>dispatch({kind:'tick',keys}),50);return ()=>window.clearInterval(timer);},[keys]);
 const pause=()=>{setKeys([]);dispatch({kind:'pause'});};
 const resume=()=>{setKeys([]);dispatch({kind:'resume'});};
 return {state,dispatch,pause,resume};
}
