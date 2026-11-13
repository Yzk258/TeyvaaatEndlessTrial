import {Check,Swords} from 'lucide-react';
import {CurrencyIcon} from '../../components/ui/CurrencyIcon';
import {adventureDifficulties} from '../../objects/AdventureSettings';
import {arenaMaps} from '../../objects/BattleMap';
import {stageCategories,stages,type StageCategoryId} from '../../objects/Stage';
import {rewardCurrencyLabels,type RewardCurrency} from '../../objects/TrialReward';

const currencyIcons={mora:'mora',primogems:'primogem'} as const satisfies Record<RewardCurrency,'mora'|'primogem'>;

type StagesPageProps={category:StageCategoryId;onCategoryChange:(id:StageCategoryId)=>void;
 onStart:(id:string)=>void;pending:boolean;clearedStages:readonly string[]};

export function StagesPage({category,onCategoryChange,onStart,pending,clearedStages}:StagesPageProps){
 const activeCategory=stageCategories.find(option=>option.id===category)??stageCategories[0];
 const availableStages=stages.filter(stage=>stage.category===category);
 const clearedCount=availableStages.filter(stage=>clearedStages.includes(stage.id)).length;

 return <section className="space-y-5">
  <header data-tutorial-target="stage-intro" className="rounded-3xl border border-emerald-100/15 bg-gradient-to-br from-[#264b41]/95 to-[#142731]/95 px-5 py-7 sm:px-8">
   <h1 className="font-serif text-4xl text-amber-50">关卡挑战</h1>
   <p className="mt-3 text-sm leading-7 text-stone-300">选择难度与奖励。角色以出战时的属性作战，击败本关全部敌人后领取奖励。</p>
  </header>
  <div className="rounded-3xl border border-white/10 bg-[#16292e]/95 p-4 sm:p-6">
   <div className="flex flex-wrap gap-2" role="group" aria-label="奖励类别">
    {stageCategories.map(option=><button key={option.id} type="button" aria-pressed={category===option.id} onClick={()=>onCategoryChange(option.id)}
     className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300 transition hover:border-amber-100/40 aria-pressed:border-amber-100 aria-pressed:bg-amber-100 aria-pressed:text-slate-900">
     {option.label}
    </button>)}
   </div>
   <div className="my-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
    <p className="text-sm text-stone-300">{activeCategory.description}</p>
    <p className="text-xs tabular-nums text-emerald-200">已通关 {clearedCount} / {availableStages.length}</p>
   </div>
   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {availableStages.map(stage=>{
     const cleared=clearedStages.includes(stage.id);
     const difficulty=adventureDifficulties[stage.difficulty];
     return <article key={stage.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#21383b] p-5 transition hover:border-emerald-100/35">
      <div className="flex flex-wrap items-center justify-between gap-2">
       <h2 className="font-serif text-2xl text-amber-50">{difficulty.level} 级</h2>
       {cleared&&<span className="inline-flex items-center gap-1.5 text-xs text-emerald-200"><Check size={14} aria-hidden="true"/>已通关</span>}
      </div>
      <p className="mt-2 text-sm text-stone-400">{arenaMaps[stage.mapId].title} · 怪物生命 ×{difficulty.healthMultiplier.toFixed(2)}</p>
      <p className="mt-3 flex items-center gap-2 text-sm text-stone-300"><Swords size={16} aria-hidden="true"/>击败 {stage.enemies} 名敌人</p>
      <div className="mb-4 mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
       {stage.rewards.map((reward,index)=><span key={index} className="inline-flex items-center gap-2 rounded-lg bg-slate-950/30 px-3 py-2 text-sm text-amber-100">
        <CurrencyIcon kind={currencyIcons[reward.currency]} size={18}/>{rewardCurrencyLabels[reward.currency]} +{reward.amount.toLocaleString()}
       </span>)}
      </div>
      <button type="button" disabled={pending} onClick={()=>onStart(stage.id)} aria-label={'开始挑战 '+difficulty.level+' 级'}
       className="mt-auto w-full rounded-full bg-[#e8dbc2] px-5 py-2.5 text-sm font-medium text-slate-900 enabled:hover:bg-amber-50 disabled:opacity-40">开始挑战</button>
     </article>;
    })}
   </div>
  </div>
 </section>;
}
