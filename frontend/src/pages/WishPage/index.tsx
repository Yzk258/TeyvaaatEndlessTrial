import {useState} from 'react';
import {WeaponWishPanel} from './components/WeaponWishPanel';
import type {Profile} from '../../objects/Profile';
import type {WishBanner,WishCount,WishPulls} from '../../objects/WishReward';
import {WishPanel} from './components/WishPanel';
import rules from '../../../../shared/wish-rules.json';
import {CurrencyIcon} from '../../components/ui/CurrencyIcon';

export function WishPage(p:{profile:Profile;onWish:(banner:WishBanner,count:WishCount)=>void;onExchangeFates:()=>void;result:WishPulls|null;pending:boolean;weaponResult:WishPulls|null}){
  const [pool,setPool]=useState<'characters'|'weapons'>('characters');
  return <div className="space-y-8">
    <header><p className="text-xs tracking-[.3em] text-violet-200/50">WISH UPON A STAR</p><h1 className="mt-4 font-serif text-4xl text-amber-50">祈愿</h1><p className="mt-4 text-sm leading-7 text-stone-400">消耗纠缠之缘结识伙伴或获取武器，两个卡池独立计数。</p></header>
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] px-5 py-3"><CurrencyIcon kind="fate" size={18}/><span className="text-sm text-stone-300">纠缠之缘 <strong className="ml-1 text-violet-200">{p.profile.intertwinedFates}</strong></span><button disabled={p.pending} onClick={p.onExchangeFates} className="ml-auto rounded-full border border-amber-100/30 px-5 py-2 text-sm text-amber-100 transition hover:bg-amber-100/10 disabled:opacity-40">兑换 · {rules.cost} 原石 → 1 纠缠之缘</button></div>
    <div data-tutorial-target="wish-pools" role="tablist" aria-label="祈愿类型" className="flex w-fit gap-3">{([{id:'characters',label:'角色祈愿'},{id:'weapons',label:'武器祈愿'}] as const).map(tab=><button key={tab.id} role="tab" aria-selected={pool===tab.id} onClick={()=>setPool(tab.id)} className={pool===tab.id?'rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900':'rounded-full border border-white/15 px-6 py-3 text-sm text-stone-400'}>{tab.label}</button>)}</div>
    {pool==='weapons'?
     <WeaponWishPanel pity={p.profile.weaponPity} fourPity={p.profile.weaponFourStarPity} result={p.weaponResult} onWish={count=>p.onWish('weapon',count)} pending={p.pending} fates={p.profile.intertwinedFates}/>:
     <WishPanel pity={p.profile.pity} fourPity={p.profile.fourStarPity} onWish={count=>p.onWish('character',count)} result={p.result} pending={p.pending} fates={p.profile.intertwinedFates}/>}
    <a href="#/characters" className="inline-block rounded-full border border-amber-100/30 px-6 py-3 text-sm text-amber-100">查看与培养角色 →</a>
  </div>;
}
