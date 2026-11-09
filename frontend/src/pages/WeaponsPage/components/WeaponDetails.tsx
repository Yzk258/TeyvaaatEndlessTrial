import {useState} from 'react';
import type {Profile} from '../../../objects/Profile';
import type {Weapon,OwnedWeapon} from '../../../objects/Weapon';
import {statLabels} from '../../../objects/Weapon';
import {weaponLabels} from '../../../objects/WeaponType';
import {characters} from '../../../objects/Character';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
export function WeaponDetails({profile,owned,definition,selected,onLevelWeapon,onEquipWeapon,pending}:{profile:Profile;owned:OwnedWeapon;definition:Weapon;selected:string;onLevelWeapon:(id:string)=>void;onEquipWeapon:(characterId:string,weaponId:string|null)=>void;pending:boolean}){
 const [target,setTarget]=useState(selected);
 const equipped=profile.equipment.find(e=>e.weaponId===owned.id);
 const targetCharacter=characters.find(c=>c.id===target);
 const compatible=definition.weapon===targetCharacter?.weapon,maxed=owned.level>=definition.maxLevel;
 const equippedHere=equipped?.characterId===target;
 return <section className="flex flex-col rounded-2xl border border-white/10 bg-[#142a31]/80 p-6 sm:p-8">
  <header><p className="text-xs tracking-widest text-amber-100/50">WEAPON ENHANCEMENT</p><h2 className="mt-3 font-serif text-3xl text-amber-50">武器强化</h2><p className="mt-3 text-sm text-stone-300">{definition.name} · Lv.{owned.level} / {definition.maxLevel}{!maxed&&<span className="ml-3 text-emerald-200">→ Lv.{owned.level+1}</span>}</p></header>
  <div className="mt-6 grid gap-4 sm:grid-cols-2">{[definition.mainStat,definition.subStat].map((stat,i)=><div key={i} className="rounded-xl bg-white/5 p-5"><p className="text-xs text-stone-400">{i===0?'主词条':'副词条'} · {statLabels[stat.kind]}</p><p className="mt-3 text-2xl text-amber-100">{formatWeaponStat(stat,owned.level)}{!maxed&&<span className="ml-3 text-lg text-emerald-200">→ {formatWeaponStat(stat,owned.level+1)}</span>}</p></div>)}</div>
  <div className="mt-5 rounded-xl border border-violet-100/15 bg-violet-100/5 p-5"><h3 className="text-sm text-violet-100">武器天赋 · {definition.talent.name}</h3><p className="mt-2 text-sm leading-6 text-stone-400">{definition.talent.description}</p></div>
  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"><span className="text-sm text-amber-100">{maxed?'已达到培养上限':definition.levelUpCost+' 摩拉 / 级'}</span><button disabled={pending||maxed||profile.mora<definition.levelUpCost} onClick={()=>onLevelWeapon(owned.id)} className="rounded-full bg-amber-100 px-7 py-3 text-sm text-slate-900 disabled:opacity-40">{pending?'正在强化…':maxed?'已满级':'提升等级'}</button></div>
  <div className="mt-6 border-t border-white/10 pt-5"><h3 className="mb-4 text-sm text-amber-50">武器装备</h3><div className="flex flex-wrap items-center gap-3"><label htmlFor="weapon-target" className="text-sm text-stone-400">装备给</label><select id="weapon-target" value={target} disabled={pending} onChange={e=>setTarget(e.target.value)} className="min-w-0 rounded-lg border border-white/20 bg-[#182a31] px-4 py-2">{profile.characters.map(c=>{const character=characters.find(d=>d.id===c.id);return character?<option key={c.id} value={c.id}>{character.name} · {weaponLabels[character.weapon]}</option>:null;})}</select><button disabled={pending||!compatible||equippedHere||(!!equipped&&equipped.characterId!==target)} onClick={()=>onEquipWeapon(target,owned.id)} className="rounded-full border border-amber-100/30 px-6 py-2 text-sm text-amber-100 disabled:opacity-40">{equippedHere?'已装备':'装备武器'}</button>{equipped&&<button disabled={pending} onClick={()=>onEquipWeapon(equipped.characterId,null)} className="py-2 text-sm text-stone-300">从{characters.find(c=>c.id===equipped.characterId)?.name}卸下</button>}</div>
   {!compatible&&<p className="mt-3 text-xs text-rose-200">该角色需要{targetCharacter&&weaponLabels[targetCharacter.weapon]}，与当前武器不匹配</p>}
   {equipped&&equipped.characterId!==target&&<p className="mt-3 text-xs text-amber-100/70">请先从当前角色卸下，再装备给其他角色。</p>}
  </div>
  <p className="mt-auto pt-5 text-xs leading-6 text-stone-500">每名角色最多装备一把武器，同一武器不能同时分配给多名角色。词条与天赋将在下次出战生效。</p>
 </section>;
}
