import type {ComponentType} from 'react';
import {Cake,CalendarCheck,Check,PartyPopper,ScrollText,Sparkles,Trophy} from 'lucide-react';
import {CurrencyIcon} from '../../components/ui/CurrencyIcon';
const CHECK_IN:readonly {readonly kind:'primogem'|'mora'|'fate';readonly amount:number}[]=[
 {kind:'mora',amount:5000},{kind:'primogem',amount:20},{kind:'mora',amount:5000},{kind:'primogem',amount:40},{kind:'mora',amount:10000},{kind:'fate',amount:1},{kind:'primogem',amount:100},
];
const UPCOMING:readonly {readonly Icon:ComponentType<{size?:number;className?:string}>;readonly title:string;readonly desc:string}[]=[
 {Icon:PartyPopper,title:'限时主题活动',desc:'随版本上线的主题活动与专属奖励。'},
 {Icon:ScrollText,title:'每日委托',desc:'每天完成小任务，领取原石与摩拉。'},
 {Icon:Trophy,title:'挑战之塔',desc:'层层递进的塔式挑战与排名奖励。'},
 {Icon:Sparkles,title:'限定祈愿',desc:'限时卡池与专属角色、武器。'},
 {Icon:Cake,title:'角色生日',desc:'角色生日当天登录领取纪念奖励。'},
];
export function ActivitiesPage({claimed,pending,onClaim,onReset}:{claimed:number;pending:boolean;onClaim:()=>void;onReset:()=>void}){
 const complete=claimed>=CHECK_IN.length;
 return <div className="space-y-8">
  <header><p className="text-xs tracking-[.3em] text-violet-200/50">EVENTS</p><h1 className="mt-4 font-serif text-4xl text-amber-50">活动</h1><p className="mt-4 text-sm leading-7 text-stone-400">查看签到演示与活动预告。演示进度保存在当前存档。</p></header>
  <section className="rounded-2xl border border-white/10 bg-[#142a31]/75 p-6">
   <div className="flex items-center gap-3 text-amber-100"><CalendarCheck size={22}/><h2 className="font-serif text-2xl text-amber-50">七日签到</h2></div>
   <p className="mt-2 text-sm text-stone-400">预览七日签到的奖励配置。</p>
   <ol className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-7">{CHECK_IN.map((reward,index)=>{const done=index<claimed,active=index===claimed;return <li key={index} className={'rounded-xl border p-3 text-center transition '+(done?'border-emerald-200/40 bg-emerald-200/[.06]':active?'border-amber-100/50 bg-amber-100/[.06]':'border-white/10 bg-white/[.02]')}><p className="text-[11px] text-stone-400">第 {index+1} 天</p><div className="my-2 flex items-center justify-center gap-1 text-amber-50"><CurrencyIcon kind={reward.kind} size={18}/><span className="text-sm">{reward.amount}</span></div><p className="h-4 text-xs text-emerald-200">{done?<Check size={14} className="mx-auto"/>:active?'今日':''}</p></li>;})}</ol>
   <div className="mt-6 flex flex-wrap items-center gap-4">
    <button disabled={complete||pending} onClick={onClaim} className="rounded-full bg-amber-100 px-7 py-3 text-sm text-slate-900 disabled:opacity-40">{complete?'本轮签到已完成':'演示签到 · 第 '+(claimed+1)+' 天'}</button>
    {complete&&<button disabled={pending} onClick={onReset} className="text-xs text-stone-400 underline underline-offset-4">重置演示签到</button>}
   </div>
  </section>
  <section>
   <h2 className="mb-4 font-serif text-2xl text-amber-50">筹备中的活动</h2>
   <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{UPCOMING.map(({Icon,title,desc})=><article key={title} className="rounded-2xl border border-white/10 bg-white/[.02] p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-100/25 hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,.75)]"><div className="flex items-center justify-between"><Icon size={22} className="text-amber-100/80"/><span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-stone-400">规划中</span></div><h3 className="mt-4 font-serif text-xl text-amber-50">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-400">{desc}</p></article>)}</div>
  </section>
 </div>;
}
