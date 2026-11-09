import {useState} from 'react';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {RarityBadge} from '../../../components/ui/RarityBadge';
import {CharacterFilterControls} from '../../../components/ui/CharacterFilterControls';
import {CharacterPageControls} from '../../../components/ui/CharacterPageControls';
import {characters,type CharacterId} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {elementLabels} from '../../../objects/Element';
import {allCharacterFilters,characterPageSize,characterRegion,matchesCharacterFilter,regionLabels} from '../../../objects/CharacterFilter';
import portraits from '../../../../../shared/character-portraits.json';
export function CharacterCollection({profile,selected,onSelect}:{profile:Profile;selected:CharacterId;onSelect:(id:CharacterId)=>void}){
 const [filter,setFilter]=useState(allCharacterFilters);
 const [index,setIndex]=useState(0);
 const matching=characters.filter(character=>matchesCharacterFilter(character.id,character.element,filter));
 const pageCount=Math.ceil(matching.length/characterPageSize);
 const start=index*characterPageSize;
 const page=matching.slice(start,start+characterPageSize);
 return <section className="space-y-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-amber-50">角色列表</h2><span className="text-xs text-stone-400">选择已拥有的角色培养与出战</span></div>
  <div className="flex flex-wrap items-center justify-between gap-3">
   <CharacterFilterControls value={filter} onChange={next=>{setFilter(next);setIndex(0);}}/>
   <p className="text-xs text-stone-400" aria-live="polite">共 {matching.length} 位角色</p>
  </div>
  {matching.length===0&&<p className="rounded-xl border border-white/10 p-5 text-center text-sm text-stone-400">没有符合筛选条件的角色。</p>}
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">{page.map(character=>{
   const owned=profile.characters.find(c=>c.id===character.id);
   return <button key={character.id} disabled={!owned} aria-pressed={selected===character.id} onClick={()=>onSelect(character.id)} className={'overflow-hidden rounded-2xl border bg-[#142a31]/75 p-4 text-left transition duration-200 hover:border-amber-100/50 enabled:hover:-translate-y-1 enabled:hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,.75)] disabled:opacity-50 '+(selected===character.id?'border-amber-100/60':'border-white/10')}>
    <div className="flex justify-between gap-2 text-xs text-stone-400"><span>{elementLabels[character.element]}</span><span>{owned?'Lv.'+owned.level:'未获得'}</span></div>
    <CharacterPortrait characterId={character.id} label={character.name+'半身立绘'} framing="bust" allowReference className="my-3 h-32 w-full"/>
    <RarityBadge rarity={character.rarity}/><h3 className="mt-2 font-serif text-xl text-amber-50">{character.name}</h3>
    <p className="mt-2 text-[11px] text-stone-400">{regionLabels[characterRegion(character.id)]} · {Object.hasOwn(portraits,character.id)?'像素立绘':'原图占位'}</p>
   </button>;
  })}</div>
  <CharacterPageControls index={index} count={pageCount} onChange={setIndex}/>
 </section>;
}
