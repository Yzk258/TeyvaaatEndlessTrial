import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import {RarityBadge} from '../../../components/ui/RarityBadge';
import type {Weapon,OwnedWeapon} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';
export function SelectedWeapon({definition,owned,equippedBy}:{definition:Weapon;owned:OwnedWeapon|undefined;equippedBy:string|undefined}){
 return <article className="overflow-hidden rounded-2xl border border-amber-100/20 bg-[#142a31]/80 p-6">
  <p className="text-xs tracking-widest text-amber-100/60">当前选择 · {owned?'Lv.'+owned.level:'未获得'}</p>
  <WeaponPortrait weaponId={definition.id} label={definition.name+'像素形象'} className={'my-5 h-64 w-full '+(owned?'':'grayscale opacity-50')}/>
  <RarityBadge rarity={definition.rarity}/><h2 className="mt-3 font-serif text-4xl text-amber-50">{definition.name}</h2><p className="mt-3 text-sm text-stone-300">{weaponLabels[definition.weapon]}</p>
  <p className="mt-2 text-xs text-stone-400">{equippedBy?'装备中 · '+equippedBy:owned?'尚未装备':'通过武器祈愿获取'}</p>
  {owned&&<p className="mt-4 text-xs text-amber-100/60">重复记录 {owned.copies}</p>}
 </article>;
}
