import rules from '../../../../../shared/wish-rules.json';
import {WishPoolPreview} from './WishPoolPreview';
import {WishActions,type WishActionsProps} from './WishActions';
export function WeaponWishPanel({pity,fourPity,...actions}:WishActionsProps&{pity:number;fourPity:number}){
 return <section className="relative overflow-hidden rounded-2xl border border-amber-100/15 bg-gradient-to-br from-[#454035] via-[#2c333a] to-[#182731] p-8">
  <p className="text-xs tracking-[.3em] text-amber-100/50">WEAPON WISH</p><h2 className="mt-4 font-serif text-3xl text-amber-50">神铸赋形</h2>
  <p className="mt-4 text-sm leading-7 text-stone-300">五星天空系列 · 四星西风系列 · 三星基础武器</p>
  <p className="mt-4 text-sm leading-7 text-stone-400">五星基础概率 {rules.weapon.fiveBaseRate*100}% · 四星基础概率 {rules.weapon.fourBaseRate*100}%<br/>仅产出武器，同星级内等概率。</p>
  <div className="mt-5 grid gap-3 sm:grid-cols-2"><p className="rounded-xl bg-white/5 p-4 text-sm text-amber-100">五星进度 {pity} / {rules.weapon.fiveHardPity}<span className="mt-2 block text-xs text-stone-400">最多{rules.weapon.fiveHardPity}抽获得五星武器</span></p><p className="rounded-xl bg-white/5 p-4 text-sm text-violet-200">四星进度 {fourPity} / {rules.weapon.fourHardPity}<span className="mt-2 block text-xs text-stone-400">最多{rules.weapon.fourHardPity}抽获得四星或以上</span></p></div>
  <p className="mt-4 text-xs leading-6 text-stone-400">五星软保底从第{rules.weapon.fiveSoftStart}抽开始递增；五星优先，四星保底可顺延。与角色池分别计数，同一武器可以重复获得。</p>
  <WishPoolPreview banner="weapon"/>
  <WishActions {...actions} singleLabel="武器祈愿"/>
 </section>;
}
