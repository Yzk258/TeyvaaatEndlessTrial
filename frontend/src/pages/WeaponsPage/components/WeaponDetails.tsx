import type {Profile} from '../../../objects/Profile';
import type {Weapon,OwnedWeapon} from '../../../objects/Weapon';
import {statLabels} from '../../../objects/Weapon';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
export function WeaponDetails({profile,owned,definition,onLevelWeapon,pending}:{profile:Profile;owned:OwnedWeapon;definition:Weapon;onLevelWeapon:(id:string)=>void;pending:boolean}){
 const maxed=owned.level>=definition.maxLevel;
 return <section className="flex flex-1 flex-col">
  <header><h2 className="font-serif text-3xl text-amber-50">武器强化</h2><p className="mt-3 text-sm text-stone-300">{definition.name} · Lv.{owned.level} / {definition.maxLevel}{!maxed&&<span className="ml-3 text-emerald-200">→ Lv.{owned.level+1}</span>}</p></header>
  <div className="mt-6 grid gap-4 sm:grid-cols-2">{[definition.mainStat,definition.subStat].map((stat,i)=><div key={i} className="rounded-xl bg-white/5 p-5"><p className="text-xs text-stone-400">{i===0?'主词条':'副词条'} · {statLabels[stat.kind]}</p><p className="mt-3 text-2xl text-amber-100">{formatWeaponStat(stat,owned.level)}{!maxed&&<span className="ml-3 text-lg text-emerald-200">→ {formatWeaponStat(stat,owned.level+1)}</span>}</p></div>)}</div>
  <div className="mt-5 rounded-xl border border-violet-100/15 bg-violet-100/5 p-5"><h3 className="text-sm text-violet-100">武器天赋 · {definition.talent.name}</h3><p className="mt-2 text-sm leading-6 text-stone-400">{definition.talent.description}</p></div>
  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"><span className="text-sm text-amber-100">{maxed?'已达到培养上限':definition.levelUpCost+' 摩拉 / 级'}</span><button disabled={pending||maxed||profile.mora<definition.levelUpCost} onClick={()=>onLevelWeapon(owned.id)} className="rounded-full bg-amber-100 px-7 py-3 text-sm text-slate-900 disabled:opacity-40">{pending?'正在强化…':maxed?'已满级':'提升等级'}</button></div>
  <p className="mt-auto pt-5 text-xs leading-6 text-stone-500">已装备武器的强化数值将在下次出战生效。</p>
 </section>;
}
