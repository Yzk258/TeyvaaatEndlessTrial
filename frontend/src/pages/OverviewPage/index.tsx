import {CharacterPortrait} from '../../components/ui/CharacterPortrait';
import {characters,type CharacterId} from '../../objects/Character';
import {weapons} from '../../objects/Weapon';
import {weaponLabels} from '../../objects/WeaponType';
import {elementLabels} from '../../objects/Element';
import type {Profile} from '../../objects/Profile';
import type {CurrentUser} from '../../objects/CurrentUser';

function Progress({label,value,total}:{label:string;value:number;total:number}){
 const percent=total>0?Math.round(value/total*100):0;
 return <div><div className="flex justify-between text-sm"><span className="text-stone-300">{label}</span><span className="text-stone-400">{value} / {total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-200/70" style={{width:percent+'%'}}/></div></div>;
}
export function OverviewPage({profile,currentUser,selected}:{profile:Profile;currentUser:CurrentUser|null;selected:CharacterId}){
 const active=characters.find(c=>c.id===selected);
 const ownedActive=profile.characters.find(c=>c.id===selected);
 const equipment=profile.equipment.find(e=>e.characterId===selected);
 const weapon=equipment?weapons.find(w=>w.id===equipment.weaponId):undefined;
 const ownedCharacters=characters.filter(c=>profile.characters.some(owned=>owned.id===c.id)).length;
 const ownedWeapons=weapons.filter(w=>profile.weapons.some(owned=>owned.id===w.id)).length;
 const identity=currentUser?.isGuest?'体验档案':currentUser?.role==='admin'?'管理员':'冒险家';
 return <div className="space-y-8">
  <header><p className="text-xs tracking-[.3em] text-emerald-100/50">OVERVIEW</p><h1 className="mt-4 font-serif text-4xl text-amber-50">综合</h1><p className="mt-3 text-sm leading-7 text-stone-400">{currentUser?currentUser.nickname+'：':'冒险者：'}这里汇总你的出战角色与收集进度。</p></header>
  <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
   <article data-tutorial-target="active-character" className="rounded-2xl border border-white/10 bg-[#142a31]/75 p-6">
    <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-amber-50">当前出战</h2><span className="rounded-full border border-amber-100/25 px-3 py-1 text-[11px] text-amber-100">{identity}</span></div>
    {active?<div className="mt-4 flex items-center gap-5">
     <CharacterPortrait characterId={active.id} label={active.name+'半身立绘'} framing="bust" allowReference className="h-28 w-24 shrink-0"/>
     <dl className="min-w-0 space-y-1.5 text-sm">
      <div className="font-serif text-xl text-amber-50">{active.name}</div>
      <div className="text-stone-400">{elementLabels[active.element]} · {weaponLabels[active.weapon]}</div>
      <div className="text-stone-300">等级 Lv.{ownedActive?.level??1} / {active.maxLevel}</div>
      <div className="text-stone-400">武器：{weapon?weapon.name:'未装备'}</div>
     </dl>
    </div>:<p className="mt-4 text-sm text-stone-400">尚未选择出战角色。</p>}
   </article>
   <article className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
    <h2 className="font-serif text-xl text-amber-50">冒险与收集</h2>
    <p className="mt-4 flex items-center justify-between text-sm"><span className="text-stone-300">已完成试炼</span><span className="text-amber-100">{profile.runs} 次</span></p>
    <div className="mt-5 space-y-4"><Progress label="角色收集" value={ownedCharacters} total={characters.length}/><Progress label="武器收集" value={ownedWeapons} total={weapons.length}/></div>
   </article>
  </section>
  <section className="flex flex-wrap gap-3">
   <a href="#/camp" className="rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900">开始冒险 →</a>
   <a href="#/stages" className="rounded-full border border-amber-100/30 px-6 py-3 text-sm text-amber-100">关卡挑战</a>
   <a href="#/wishes" className="rounded-full border border-amber-100/30 px-6 py-3 text-sm text-amber-100">前往祈愿</a>
   <a href="#/characters" className="rounded-full border border-white/15 px-6 py-3 text-sm text-stone-400">培养角色</a>
  </section>
 </div>;
}
