import rules from '../../../../../shared/adventure-rules.json';
import {BattleDifficultyPicker} from '../../../components/ui/BattleDifficultyPicker';
import {adventureDifficulties,type AdventureDifficultyId,type AdventureSettings} from '../../../objects/AdventureSettings';

export type AdventureSetupProps={
 difficulty:AdventureDifficultyId;
 onDifficultyChange:(id:AdventureDifficultyId)=>void;
 pending:boolean;
 onStart:(settings:AdventureSettings)=>void;
};

export function AdventureSetup({difficulty,onDifficultyChange,pending,onStart}:AdventureSetupProps){
 const rewardMultiplier=adventureDifficulties[difficulty].rewardMultiplier;
 return <form onSubmit={event=>{event.preventDefault();onStart({difficulty});}}>
  <BattleDifficultyPicker name="adventure-difficulty" label="选择无尽难度" difficulty={difficulty} onChange={onDifficultyChange}
   pending={pending} tutorialTarget="adventure-mode"/>
   <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
    <p className="text-xs leading-6 text-stone-400">当前难度摩拉与原石奖励 ×{rewardMultiplier}。每 {rules.stepSeconds} 秒增强下一波敌人。<br/>每 {rules.timeBlockSeconds} 秒获得 {rules.moraPerTimeBlock*rewardMultiplier} 摩拉和 {rules.primogemsPerTimeBlock*rewardMultiplier} 原石，击败敌人也会累计奖励。</p>
    <button data-tutorial-target="adventure-start" type="submit" disabled={pending} className="rounded-full bg-[#e8dbc2] px-7 py-3 text-sm font-medium text-[#243630] enabled:hover:bg-amber-50 disabled:opacity-40">{pending?'正在准备…':'开始无尽冒险'}</button>
   </div>
 </form>;
}
