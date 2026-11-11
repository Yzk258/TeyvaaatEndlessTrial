import {WeaponCardArt} from './WeaponCardArt';
import {RarityBadge} from '../../../components/ui/RarityBadge';
import type {Character} from '../../../objects/Character';
import type {Weapon,OwnedWeapon} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';
export function SelectedWeapon({definition,owned,instances,owners,onSelect,pending}:{
 definition:Weapon;owned:OwnedWeapon|undefined;instances:readonly OwnedWeapon[];
 owners:ReadonlyMap<string,Character|undefined>;onSelect:(weaponInstanceId:string)=>void;pending:boolean;
}){
 const equippedBy=owned?owners.get(owned.id):undefined;
 return <article className={'overflow-hidden rounded-2xl border border-amber-100/20 p-6 '+(owned?'bg-[#142a31]/80':'bg-[#29424a]/85')}>
  <p className="text-xs tracking-widest text-amber-100/60">当前选择 · {owned?'Lv.'+owned.level:'未获得'}</p>
  <WeaponCardArt weapon={definition} equippedBy={equippedBy} large silhouette={!owned}/>
  <RarityBadge rarity={definition.rarity}/><h2 className="mt-3 font-serif text-4xl text-amber-50">{definition.name}</h2><p className="mt-3 text-sm text-stone-300">{weaponLabels[definition.weapon]}</p>
  <p className="mt-2 text-xs text-stone-400">{equippedBy?'装备中 · '+equippedBy.name:owned?'尚未装备':'通过武器祈愿获取'}</p>
  {owned&&<p className="mt-4 text-xs text-amber-100/80">数量 {instances.length}</p>}
  {instances.length>1&&<label className="mt-4 block text-xs text-stone-300">
   选择武器副本
   <select value={owned?.id} disabled={pending} onChange={event=>onSelect(event.target.value)}
    className="mt-2 block w-full rounded-lg border border-white/15 bg-[#182a31] px-3 py-2 text-sm text-amber-50 disabled:opacity-50">
    {instances.map((instance,index)=>{
     const owner=owners.get(instance.id);
     return <option key={instance.id} value={instance.id}>第 {index+1} 把 · Lv.{instance.level}{owner?' · '+owner.name+'装备中':''}</option>;
    })}
   </select>
  </label>}
 </article>;
}
