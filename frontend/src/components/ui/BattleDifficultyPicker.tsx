import {adventureDifficulties,type AdventureDifficultyId} from '../../objects/AdventureSettings';

const difficultyIds=Object.keys(adventureDifficulties) as AdventureDifficultyId[];

export function BattleDifficultyPicker({name,label,difficulty,onChange,pending,tutorialTarget}:{
 name:string;label:string;difficulty:AdventureDifficultyId;onChange:(id:AdventureDifficultyId)=>void;
 pending:boolean;tutorialTarget?:string;
}){
 return <fieldset disabled={pending} data-tutorial-target={tutorialTarget} className="disabled:opacity-60">
  <legend className="mb-3 text-sm font-medium text-stone-200">{label}</legend>
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
   {difficultyIds.map(id=>{
    const option=adventureDifficulties[id];
    return <label key={id} className="block cursor-pointer">
     <input type="radio" name={name} value={id} checked={difficulty===id} onChange={()=>onChange(id)} className="peer sr-only"/>
     <span className="block h-full rounded-xl border border-white/10 bg-[#12252c]/80 px-3 py-3 text-stone-300 transition hover:border-emerald-100/30 peer-checked:border-emerald-200/65 peer-checked:bg-emerald-200/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-100">
      <span className="block font-serif text-lg text-amber-50">{option.level} 级</span>
      <span className="mt-1 block text-xs leading-5 tabular-nums">普通怪生命 ×{option.healthMultiplier.toFixed(2)}</span>
      <span className="block text-xs leading-5 tabular-nums">首领与精英 ×{option.eliteHealthMultiplier.toFixed(2)}</span>
     </span>
    </label>;
   })}
  </div>
 </fieldset>;
}
