import rules from '../../../../../shared/adventure-rules.json';
import {adventureDifficulties,type AdventureDifficultyId,type AdventureSettings} from '../../../objects/AdventureSettings';

const difficultyIds=Object.keys(adventureDifficulties) as AdventureDifficultyId[];

export type AdventureSetupProps={
 difficulty:AdventureDifficultyId;
 onDifficultyChange:(id:AdventureDifficultyId)=>void;
 pending:boolean;
 onStart:(settings:AdventureSettings)=>void;
};

export function AdventureSetup({difficulty,onDifficultyChange,pending,onStart}:AdventureSetupProps){
 return <form onSubmit={event=>{event.preventDefault();onStart({difficulty});}}>
  <fieldset disabled={pending} className="disabled:opacity-60">
   <legend className="mb-3 text-sm font-medium text-stone-200">选择无尽难度</legend>
   <div data-tutorial-target="adventure-mode" className="grid gap-3 sm:grid-cols-3">
    {difficultyIds.map(id=>{
     const option=adventureDifficulties[id];
     return <label key={id} className="block cursor-pointer">
      <input type="radio" name="adventure-difficulty" value={id} checked={difficulty===id} onChange={()=>onDifficultyChange(id)} className="peer sr-only"/>
      <span className="flex h-full flex-wrap items-baseline justify-between gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-[#12252c]/80 px-4 py-4 text-stone-300 transition hover:border-emerald-100/30 peer-checked:border-emerald-200/65 peer-checked:bg-emerald-200/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-100 sm:block">
       <span className="block font-serif text-xl text-amber-50">{option.label}</span>
       <span className="block text-xs leading-6 tabular-nums sm:mt-2">生命 ×{option.healthMultiplier.toFixed(2)} · 伤害 ×{option.damageMultiplier.toFixed(2)}</span>
      </span>
     </label>;
    })}
   </div>
   <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
    <p className="text-xs leading-6 text-stone-400">每 {rules.stepSeconds} 秒增强下一波敌人。<br/>每 {rules.timeBlockSeconds} 秒获得 {rules.moraPerTimeBlock} 摩拉和 {rules.primogemsPerTimeBlock} 原石，击败敌人也会累计奖励。</p>
    <button data-tutorial-target="adventure-start" type="submit" className="rounded-full bg-[#e8dbc2] px-7 py-3 text-sm font-medium text-[#243630] enabled:hover:bg-amber-50 disabled:opacity-40">{pending?'正在准备…':'开始无尽冒险'}</button>
   </div>
  </fieldset>
 </form>;
}
