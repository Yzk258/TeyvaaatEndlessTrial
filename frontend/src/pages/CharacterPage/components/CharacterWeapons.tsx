import {RarityBadge} from '../../../components/ui/RarityBadge';
import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import {groupOwnedWeapons} from '../../../game/functions/weaponInventory';
import {characters,type Character} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {weapons} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';

export function CharacterWeapons({profile,character,onEquipWeapon,pending}:{
 profile:Profile;character:Character;onEquipWeapon:(weaponInstanceId:string|null)=>void;pending:boolean;
}){
 const owned=profile.characters.some(entry=>entry.id===character.id);
 const groups=groupOwnedWeapons(profile.weapons);
 const compatible=weapons.filter(weapon=>weapon.weapon===character.weapon).flatMap(weapon=>{
  const items=groups.get(weapon.id)??[];
  return items.map((item,index)=>({item,weapon,label:items.length===1?weapon.name:`${weapon.name} · 第 ${index+1} 把`}));
 });
 const equippedId=profile.equipment.find(entry=>entry.characterId===character.id)?.weaponInstanceId;
 const equipped=compatible.find(({item})=>item.id===equippedId);
 const alternatives=compatible.filter(({item})=>item.id!==equippedId);

 return <div>
  <h2 className="font-serif text-3xl text-amber-50">武器装备</h2>
  <p className="mt-3 text-sm text-stone-300">{character.name} · {weaponLabels[character.weapon]}</p>
  {!owned?<p className="mt-5 text-sm text-stone-400">获得角色后可为其装备武器。</p>:<>
   {equipped?<div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100/20 bg-emerald-100/5 p-4">
    <WeaponPortrait weaponId={equipped.weapon.id} label={equipped.weapon.name+'像素形象'} className="size-16 shrink-0"/>
    <div className="min-w-0 flex-1"><p className="text-xs text-emerald-200">当前装备</p><p className="mt-1 text-amber-50">{equipped.label} · Lv.{equipped.item.level}</p></div>
    <button type="button" disabled={pending} onClick={()=>onEquipWeapon(null)} className="rounded-full border border-white/20 px-4 py-2 text-sm text-stone-200 enabled:hover:bg-white/10 disabled:opacity-40">卸下武器</button>
   </div>:<p className="mt-5 rounded-xl border border-white/10 px-4 py-3 text-sm text-stone-400">当前未装备武器</p>}
   <div className="mt-6 border-t border-white/10 pt-5">
    <h3 className="text-sm font-medium text-amber-50">已拥有的{weaponLabels[character.weapon]}</h3>
    {alternatives.length===0?<p className="mt-3 text-sm text-stone-400">{equipped?'暂无其他同类型武器。':'还没有可装备的武器。'}</p>:
     <ul className="mt-3 grid gap-3 xl:grid-cols-2">{alternatives.map(({item,weapon,label})=>{
      const wearer=profile.equipment.find(entry=>entry.weaponInstanceId===item.id);
      const wearerName=characters.find(entry=>entry.id===wearer?.characterId)?.name;
      return <li key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3">
       <WeaponPortrait weaponId={weapon.id} label={weapon.name+'像素形象'} className="size-12 shrink-0"/>
       <div className="min-w-0 flex-1"><p className="text-sm text-stone-100">{label} · Lv.{item.level}</p><RarityBadge rarity={weapon.rarity}/></div>
       {wearer?<span className="text-xs text-stone-400">{wearerName??'其他角色'}装备中</span>:
        <button type="button" disabled={pending} aria-label={'装备 '+label} onClick={()=>onEquipWeapon(item.id)}
         className="rounded-full bg-amber-100 px-4 py-1.5 text-sm text-slate-900 enabled:hover:bg-amber-50 disabled:opacity-40">装备</button>}
      </li>;
     })}</ul>}
   </div>
  </>}
 </div>;
}
