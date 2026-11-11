import rules from '../../../../../shared/wish-rules.json';
import {WishPoolPreview} from './WishPoolPreview';
import {WishActions,type WishActionsProps} from './WishActions';
export function WishPanel({pity,fourPity,...actions}:WishActionsProps&{pity:number;fourPity:number}){
 return <section className="relative overflow-hidden rounded-2xl border border-violet-200/15 bg-gradient-to-br from-[#30304c] via-[#222b3c] to-[#182731] p-8">
  <p className="text-xs tracking-[.3em] text-violet-200/60">CHARACTER WISH</p><h2 className="mt-4 font-serif text-3xl text-stone-100">群星同行</h2>
  <p className="mt-3 text-sm leading-7 text-stone-300">五星角色 · 四星角色与武器 · 三星武器</p>
  <p className="mt-4 text-sm leading-7 text-stone-400">五星基础概率 {rules.character.fiveBaseRate*100}% · 四星基础概率 {rules.character.fourBaseRate*100}%<br/>四星奖励中角色与武器各占50%，同类同星级内等概率。</p>
  <div className="mt-5 grid gap-3 sm:grid-cols-2"><p className="rounded-xl bg-white/5 p-4 text-sm text-amber-100">五星进度 {pity} / {rules.character.fiveHardPity}<span className="mt-2 block text-xs text-stone-400">最多{rules.character.fiveHardPity}抽获得五星角色</span></p><p className="rounded-xl bg-white/5 p-4 text-sm text-violet-200">四星进度 {fourPity} / {rules.character.fourHardPity}<span className="mt-2 block text-xs text-stone-400">最多{rules.character.fourHardPity}抽获得四星或以上</span></p></div>
  <p className="mt-4 text-xs leading-6 text-stone-400">五星软保底从第{rules.character.fiveSoftStart}抽开始递增；五星优先，四星保底可顺延。当前为固定卡池，同一物品可以重复获得。</p>
  <WishPoolPreview banner="character"/>
  <WishActions {...actions}/>
 </section>;
}
