import {RarityBadge} from '../../../components/ui/RarityBadge';
import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import {statLabels,type Weapon} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
export function WeaponEntries({entries}:{entries:readonly {readonly definition:Weapon;readonly quantity:number}[]}){
 return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{entries.map(({definition:w,quantity})=><article key={w.id} aria-label={w.name+(quantity?'，已解锁':'，未解锁')} className={quantity?'rounded-2xl border border-amber-100/25 bg-amber-100/[.03] p-6':'rounded-2xl border border-white/10 bg-[#29424a]/75 p-6'}>
  <div className="flex justify-between text-xs text-stone-400"><span>{weaponLabels[w.weapon]}</span><span className={quantity?'text-emerald-200':'text-stone-400'}>{quantity?'数量 '+quantity:'未解锁'}</span></div>
  <WeaponPortrait weaponId={w.id} label={w.name} silhouette={quantity===0} className="my-6 h-44 w-full"/><RarityBadge rarity={w.rarity}/><h2 className="mt-2 font-serif text-2xl text-amber-50">{w.name}</h2>
  <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">{[w.mainStat,w.subStat].map((stat,i)=><p key={i}><span className="text-stone-400">{i===0?'主词条':'副词条'} · {statLabels[stat.kind]}</span><span className="ml-3 text-amber-100">{formatWeaponStat(stat,1)}</span><span className="ml-2 text-xs text-stone-500">（1级）</span></p>)}</div>
  <div className="mt-5 rounded-xl bg-white/5 p-4"><h3 className="text-sm text-violet-100">天赋 · {w.talent.name}</h3><p className="mt-2 text-xs leading-6 text-stone-400">{w.talent.description}</p></div>
  <p className="mt-4 text-xs text-stone-400">上限 {w.maxLevel}级 · 每级 {w.levelUpCost}摩拉</p>{quantity===0&&<p className="mt-2 text-xs text-stone-400">获取途径：武器祈愿</p>}
 </article>)}</div>;
}
