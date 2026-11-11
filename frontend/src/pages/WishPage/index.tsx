import {useState} from 'react';
import {WeaponWishPanel} from './components/WeaponWishPanel';
import type {Profile} from '../../objects/Profile';
import type {WishBanner,WishCount,WishPulls} from '../../objects/WishReward';
import {WishPanel} from './components/WishPanel';

export function WishPage(p:{profile:Profile;onWish:(banner:WishBanner,count:WishCount)=>void;result:WishPulls|null;pending:boolean;weaponResult:WishPulls|null}){
  const [pool,setPool]=useState<'characters'|'weapons'>('characters');
  return <div className="space-y-8">
    <header><p className="text-xs tracking-[.3em] text-violet-200/50">WISH UPON A STAR</p><h1 className="mt-4 font-serif text-4xl text-amber-50">祈愿</h1><p className="mt-4 text-sm leading-7 text-stone-400">消耗纠缠之缘结识伙伴或获取武器，两个卡池独立计数。</p></header>
    <div data-tutorial-target="wish-pools" role="tablist" aria-label="祈愿类型" className="flex w-fit gap-3">{([{id:'characters',label:'角色祈愿'},{id:'weapons',label:'武器祈愿'}] as const).map(tab=><button key={tab.id} role="tab" aria-selected={pool===tab.id} onClick={()=>setPool(tab.id)} className={pool===tab.id?'rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900':'rounded-full border border-white/15 px-6 py-3 text-sm text-stone-400'}>{tab.label}</button>)}</div>
    {pool==='weapons'?
     <WeaponWishPanel pity={p.profile.weaponPity} fourPity={p.profile.weaponFourStarPity} result={p.weaponResult} onWish={count=>p.onWish('weapon',count)} pending={p.pending}/>:
     <WishPanel pity={p.profile.pity} fourPity={p.profile.fourStarPity} onWish={count=>p.onWish('character',count)} result={p.result} pending={p.pending}/>}
    <a href="#/characters" className="inline-block rounded-full border border-amber-100/30 px-6 py-3 text-sm text-amber-100">查看与培养角色 →</a>
  </div>;
}
