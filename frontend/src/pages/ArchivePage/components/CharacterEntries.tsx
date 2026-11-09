import {RarityBadge} from '../../../components/ui/RarityBadge';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {attackPatternLabels} from '../../../objects/AttackPattern';
import type {Character} from '../../../objects/Character';
import {elementLabels} from '../../../objects/Element';
import {weaponLabels} from '../../../objects/WeaponType';
import {attackStyleLabels} from '../../../objects/AttackStyle';
import {characterRegion,regionLabels} from '../../../objects/CharacterFilter';
export function CharacterEntries({entries,references}:{entries:readonly {readonly definition:Character;readonly owned:{readonly level:number;readonly copies:number}|undefined}[];references:readonly {readonly id:string;readonly name:string}[]}){
 return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{entries.map(({definition:c,owned})=><article key={c.id} aria-label={c.name+(owned?'，已解锁':'，未解锁')} className={owned?'rounded-2xl border border-amber-100/25 bg-amber-100/[.03] p-6':'rounded-2xl border border-white/10 bg-white/[.02] p-6 grayscale opacity-60'}>
  <div className="flex items-center justify-between text-xs"><span className="text-stone-400">{elementLabels[c.element]} · {weaponLabels[c.weapon]} · {attackStyleLabels[c.attackStyle]}</span><span className={owned?'text-emerald-200':'text-stone-400'}>{owned?'已解锁 · Lv.'+owned.level:'未解锁'}</span></div>
  <CharacterPortrait characterId={c.id} label={c.name+'立绘'} allowReference className="my-4 h-40 w-full"/>
  <RarityBadge rarity={c.rarity}/><p className="mt-2 text-xs text-stone-400">{regionLabels[characterRegion(c.id)]} · {c.title}</p><h2 className="mt-2 font-serif text-3xl text-amber-50">{c.name}</h2>
  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm"><div><dt className="text-xs text-stone-500">1级攻击 / 生命</dt><dd className="mt-1">{c.baseAttack} / {c.baseHp}</dd></div><div><dt className="text-xs text-stone-500">每级成长</dt><dd className="mt-1">攻击 +{c.attackGrowth} / 生命 +{c.hpGrowth}</dd></div><div><dt className="text-xs text-stone-500">范围 / 攻击间隔</dt><dd className="mt-1">{c.attackRange} / {(c.attackIntervalTicks/20).toFixed(2)} 秒</dd></div><div><dt className="text-xs text-stone-500">培养上限 / 单级消耗</dt><dd className="mt-1">{c.maxLevel}级 / {c.levelUpCost}摩拉</dd></div></dl>
  <p className="mt-4 text-xs text-stone-300">{c.attackVisual.name} · {attackPatternLabels[c.attackPattern.kind]}</p><p className="mt-5 text-xs text-stone-400">{owned?'重复印记 '+owned.copies:c.inStandardBanner?'获取途径：角色祈愿':'当前未加入常驻角色祈愿'}</p>
 </article>)}{references.map(({id,name})=><article key={id} aria-label={name+'，资料收录'} className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
  <p className="text-xs text-stone-400">{regionLabels[characterRegion(id)]} · 资料收录</p>
  <CharacterPortrait characterId={id} label={name+'立绘'} allowReference className="my-4 h-40 w-full"/>
  <h2 className="font-serif text-2xl text-amber-50">{name}</h2>
 </article>)}</div>;
}
