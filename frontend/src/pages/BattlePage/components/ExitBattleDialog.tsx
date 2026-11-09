import type {BattleState} from '../../../game/objects/BattleState';
import {AdventureResult} from './AdventureResult';
export function ExitBattleDialog({state,stage,pending,onConfirm,onCancel}:{state:BattleState;stage:boolean;pending:boolean;onConfirm:()=>void;onCancel:()=>void}){
 return <div role="dialog" aria-modal="true" aria-label={stage?'确认放弃挑战':'确认撤离并结算'} className="absolute inset-0 z-20 grid place-content-center gap-5 bg-slate-950/95 px-5 text-center">
  <h2 className="font-serif text-3xl text-amber-100">{stage?'确认放弃本次挑战？':'现在撤离并结算？'}</h2>
  <p className="text-sm text-stone-400">{stage?'退出将丢失本局进度，不发放通关奖励。':'已累计的奖励会保留，撤离后返回冒险页面。'}</p>
  {!stage&&<AdventureResult state={state}/>}
  <button disabled={pending} onClick={onConfirm} className="rounded-full bg-amber-100 px-7 py-3 text-slate-900 disabled:opacity-40">{pending?'正在结算…':stage?'确认放弃':'撤离并领取奖励'}</button>
  <button disabled={pending} onClick={onCancel} className="text-sm text-stone-300">返回战斗</button>
 </div>;
}
