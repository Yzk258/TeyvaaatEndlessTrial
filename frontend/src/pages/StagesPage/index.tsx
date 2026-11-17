import {Check,Swords} from 'lucide-react';
import type {ReactNode} from 'react';
import {CurrencyIcon} from '../../components/ui/CurrencyIcon';
import {ElementalCrystalIcon} from '../../components/ui/ElementalCrystalIcon';
import {EnemySprite,hypostasisSprite} from '../../components/ui/EnemySprite';
import {adventureDifficulties} from '../../objects/AdventureSettings';
import {arenaMaps} from '../../objects/BattleMap';
import {leyLineCategories,stages,type LeyLineCategoryId,type Stage} from '../../objects/Stage';
import {formatTrialReward,type RewardCurrency} from '../../objects/TrialReward';
import {elements,elementLabels,type Element} from '../../objects/Element';
import {crystalRarities} from '../../objects/ElementalCrystal';
import {hypostases} from '../../objects/Hypostasis';

const currencyIcons={mora:'mora',primogems:'primogem'} as const satisfies Record<RewardCurrency,'mora'|'primogem'>;

type TrialPageProps={onStart:(id:string)=>void;pending:boolean;clearedStages:readonly string[]};

export function LeyLinePage({category,onCategoryChange,...props}:TrialPageProps&{
 category:LeyLineCategoryId;onCategoryChange:(category:LeyLineCategoryId)=>void
}){
 const selected=leyLineCategories.find(option=>option.id===category);
 return <TrialSelection {...props} title="地脉之花" intro="击败全部敌人，领取摩拉或原石。"
  description={selected?.description??''} availableStages={stages.filter(stage=>stage.category===category)}>
  <div className="flex flex-wrap gap-2" role="group" aria-label="奖励类别">
   {leyLineCategories.map(option=><button key={option.id} type="button" aria-pressed={category===option.id} onClick={()=>onCategoryChange(option.id)}
    className="rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300 transition hover:border-amber-100/40 aria-pressed:border-amber-100 aria-pressed:bg-amber-100 aria-pressed:text-slate-900">
    {option.label}
   </button>)}
  </div>
 </TrialSelection>;
}

export function BossHuntPage({element,onElementChange,...props}:TrialPageProps&{
 element:Element;onElementChange:(element:Element)=>void
}){
 const availableStages=stages.filter(stage=>stage.category==='crystals'&&stage.boss===element);
 return <TrialSelection {...props} title="首领征讨" intro="击败无相首领，领取对应的突破晶石。"
  description="首领从共用招式中随机出招，每完成三轮攻击后暴露核心。" availableStages={availableStages}
  portrait={<EnemySprite sprite={hypostasisSprite(element)} className="size-20 shrink-0 sm:size-24"/>}>
  <div className="flex flex-wrap gap-2" role="group" aria-label="晶石元素">
   {elements.map(id=><button key={id} type="button" aria-pressed={element===id} onClick={()=>onElementChange(id)}
    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-stone-200 hover:border-emerald-100/40 aria-pressed:border-emerald-100 aria-pressed:bg-emerald-100 aria-pressed:text-slate-900">
    {elementLabels[id]}
   </button>)}
  </div>
 </TrialSelection>;
}

function TrialSelection({title,intro,description,availableStages,onStart,pending,clearedStages,children,portrait}:TrialPageProps&{
 title:string;intro:string;description:string;availableStages:readonly Stage[];children:ReactNode;portrait?:ReactNode
}){
 return <section className="space-y-5">
  <header data-tutorial-target="stage-intro" className="flex items-center justify-between gap-4 rounded-3xl border border-emerald-100/15 bg-gradient-to-br from-[#264b41]/95 to-[#142731]/95 px-5 py-7 sm:px-8">
   <div>
    <h1 className="font-serif text-4xl text-amber-50">{title}</h1>
    <p className="mt-3 text-sm leading-7 text-stone-300">{intro}</p>
   </div>
   {portrait}
  </header>
  <div className="rounded-3xl border border-white/10 bg-[#16292e]/95 p-4 sm:p-6">
   {children}
   <p className="my-5 border-b border-white/10 pb-4 text-sm text-stone-300">{description}</p>
   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {availableStages.map(stage=>{
     const cleared=clearedStages.includes(stage.id);
     const difficulty=adventureDifficulties[stage.difficulty];
     const boss=stage.category==='crystals'?hypostases[stage.boss]:null;
     return <article key={stage.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#21383b] p-5 transition hover:border-emerald-100/35">
      <div className="flex flex-wrap items-center justify-between gap-2">
       <h2 className="font-serif text-2xl text-amber-50">{difficulty.level} 级</h2>
       {cleared&&<span className="inline-flex items-center gap-1.5 text-xs text-emerald-200"><Check size={14} aria-hidden="true"/>已通关</span>}
      </div>
      <p className="mt-2 text-sm text-stone-400">{arenaMaps[stage.mapId].title} · {boss?'首领':'怪物'}生命 ×{(boss?difficulty.eliteHealthMultiplier:difficulty.healthMultiplier).toFixed(2)}</p>
      <p className="mt-3 flex items-center gap-2 text-sm text-stone-300"><Swords size={16} aria-hidden="true"/>{boss?'击败 '+boss.name:'击败 '+stage.enemies+' 名敌人'}</p>
      <div className="mb-4 mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
       {stage.rewards.map((reward,index)=><span key={index} className="inline-flex items-center gap-2 rounded-lg bg-slate-950/30 px-3 py-2 text-sm text-amber-100"
        style={reward.kind==='elementalCrystal'?{color:crystalRarities[reward.crystal.rarity].color}:undefined}>
        {reward.kind==='currency'?<CurrencyIcon kind={currencyIcons[reward.currency]} size={18}/>:
         <ElementalCrystalIcon crystal={reward.crystal} size={20}/>}
        {formatTrialReward(reward)}
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
