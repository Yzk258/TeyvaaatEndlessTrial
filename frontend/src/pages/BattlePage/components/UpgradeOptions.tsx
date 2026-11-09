import type {BattleState} from '../../../game/objects/BattleState';
import {upgradeTitles,type UpgradeChoice} from '../../../game/objects/UpgradeChoice';
import {upgradePreview} from '../functions/upgradePreview';
const symbols:Readonly<Record<UpgradeChoice,string>>={power:'✦',heal:'+',range:'◎',attackSpeed:'»',moveSpeed:'↗',maxHp:'◇',extraAttack:'×'};
export function UpgradeOptions({state,onChoose}:{state:BattleState;onChoose:(choice:UpgradeChoice)=>void}){
 return <div role="dialog" aria-modal="true" aria-labelledby="upgrade-title" className="absolute inset-0 grid place-content-center gap-5 overflow-y-auto bg-slate-950/90 px-5 py-8 text-center">
  <h2 id="upgrade-title" className="font-serif text-3xl text-amber-100">星辉赐福</h2><p className="text-sm text-stone-400">随机三选一 · 战斗已暂停 · 剩余 {state.pendingUpgrades} 次</p>
  <div className="grid max-w-4xl gap-4 sm:grid-cols-3">{state.upgradeChoices.map(choice=><button key={choice} onClick={()=>onChoose(choice)} className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-amber-200/30 bg-[#172b32] px-6 py-7 transition hover:border-amber-100 hover:bg-[#273b41] focus-visible:outline-2 focus-visible:outline-amber-100"><span aria-hidden="true" className="text-3xl text-amber-100">{symbols[choice]}</span><span className="font-serif text-2xl text-amber-50">{upgradeTitles[choice]}</span><span className="max-w-56 text-sm leading-6 text-stone-300">{upgradePreview(state,choice)}</span></button>)}</div>
  <p className="text-xs text-stone-500">仅在本次试炼生效 · 选择后继续战斗</p>
 </div>;
}
