import type {BattleState} from '../objects/BattleState';
import {upgradeChoices,type UpgradeChoice} from '../objects/UpgradeChoice';
export function applyUpgradeStats(state:BattleState,choice:UpgradeChoice):BattleState {
 switch(choice){
  case 'power':return {...state,power:Math.round((state.power+1)*100)/100};
  case 'heal':return {...state,hp:Math.min(state.maxHp,state.hp+35)};
  case 'range':return {...state,attackRange:Math.round(state.attackRange*1.2),attackPattern:state.attackPattern.kind==='area'?{...state.attackPattern,splashRadius:Math.round(state.attackPattern.splashRadius*1.2)}:state.attackPattern};
  case 'attackSpeed':return {...state,attackIntervalTicks:Math.max(2,Math.floor(state.attackIntervalTicks*.85))};
  case 'moveSpeed':return {...state,moveSpeed:Math.min(12,Math.round(state.moveSpeed*1.15*100)/100)};
  case 'maxHp':return {...state,maxHp:state.maxHp+25,hp:state.hp+25};
  case 'extraAttack':return {...state,extraAttacks:Math.min(3,state.extraAttacks+1)};
 }
}
export function rollUpgradeChoices(state:BattleState):{readonly choices:readonly UpgradeChoice[];readonly seed:number}{
 const eligible=upgradeChoices.filter(choice=>choice==='heal'?state.hp<state.maxHp:choice==='attackSpeed'?state.attackIntervalTicks>2:choice==='moveSpeed'?state.moveSpeed<12:choice==='extraAttack'?state.extraAttacks<3:true);
 const select=(remaining:readonly UpgradeChoice[],seed:number,chosen:readonly UpgradeChoice[]):{choices:readonly UpgradeChoice[];seed:number}=>{
  if(chosen.length===3||remaining.length===0)return {choices:chosen,seed};
  const next=(Math.imul(seed,1664525)+1013904223)>>>0,index=next%remaining.length;
  return select(remaining.filter((_,i)=>i!==index),next,[...chosen,remaining[index]]);
 };
 return select(eligible,state.upgradeSeed,[]);
}
