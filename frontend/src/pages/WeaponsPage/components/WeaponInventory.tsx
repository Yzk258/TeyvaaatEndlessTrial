import {RarityBadge} from '../../../components/ui/RarityBadge';
import {WeaponCardArt} from './WeaponCardArt';
import type {Character} from '../../../objects/Character';
import {weapons,statLabels,type OwnedWeapon} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';
import {formatWeaponStat} from '../../../game/functions/weaponStats';

export function WeaponInventory({groups,owners,selectedId,onSelect}:{
 groups:ReadonlyMap<string,readonly OwnedWeapon[]>;owners:ReadonlyMap<string,Character|undefined>;
 selectedId:string|undefined;onSelect:(weaponInstanceId:string)=>void;
}){
 return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
  {weapons.map(weapon=>{
   const instances=groups.get(weapon.id)??[];
   const item=instances.find(entry=>entry.id===selectedId)??instances[0];
   const equippedBy=item?owners.get(item.id):undefined;
   const selected=!!item&&selectedId===item.id;
   const level=item?.level??1;
   return <button key={weapon.id} type="button" aria-pressed={selected} disabled={!item} onClick={()=>{if(item)onSelect(item.id);}}
    className={`rounded-2xl border bg-[#142a31]/75 p-4 text-left transition duration-200 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,.75)] disabled:bg-[#29424a]/85 ${selected?'border-amber-100/60 bg-amber-100/5':'border-white/10 bg-white/[.02]'}`}>
    <div className="flex justify-between text-xs text-stone-400">
     <span>{weaponLabels[weapon.weapon]}</span><span>{item?'Lv.'+level:'未获得'}</span>
    </div>
    <WeaponCardArt weapon={weapon} equippedBy={equippedBy} silhouette={!item}/>
    <RarityBadge rarity={weapon.rarity}/><h2 className="mt-2 font-serif text-xl text-amber-50">{weapon.name}</h2>
    <p className="mt-3 text-xs leading-6 text-stone-400">{statLabels[weapon.mainStat.kind]} {formatWeaponStat(weapon.mainStat,level)} · {statLabels[weapon.subStat.kind]} {formatWeaponStat(weapon.subStat,level)}</p>
    <p className="mt-2 text-xs text-stone-400">{item?'数量 '+instances.length:'通过武器祈愿获得'}{equippedBy&&' · '+equippedBy.name+'装备中'}</p>
   </button>;
  })}
 </div>;
}
