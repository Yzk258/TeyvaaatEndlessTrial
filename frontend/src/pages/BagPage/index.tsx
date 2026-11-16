import {useState} from 'react';
import {ArtifactGrid} from '../../components/ui/ArtifactGrid';
import {ElementalCrystalIcon} from '../../components/ui/ElementalCrystalIcon';
import {formatWeaponStat} from '../../game/functions/weaponStats';
import {artifacts,artifactSlots} from '../../objects/Artifact';
import type {Profile} from '../../objects/Profile';
import {crystalRarities,elementalCrystals} from '../../objects/ElementalCrystal';
import {statLabels} from '../../objects/Weapon';

const slotCount=40;

export function BagPage({profile}:{profile:Profile}){
 const [selected,setSelected]=useState<string>();
 const item=profile.artifacts.find(entry=>entry.id===selected);
 const definition=artifacts.find(entry=>entry.id===item?.artifactId);
 const crystals=elementalCrystals.filter(crystal=>(profile.crystals[crystal.id]??0)>0);
 return <section className="max-w-4xl space-y-5">
  <header>
   <h1 className="font-serif text-4xl text-amber-50">背包</h1>
   <p className="mt-3 text-sm leading-7 text-stone-300">用于存放圣遗物和道具。</p>
  </header>
  <div className="rounded-2xl border border-amber-100/15 bg-[#142a31]/90 p-4 sm:p-6">
   <p className="mb-4 text-sm text-stone-300">圣遗物 {profile.artifacts.length} 件</p>
   <ArtifactGrid items={profile.artifacts} selected={selected} onSelect={setSelected} minSlots={slotCount}/>
   {item&&definition&&<div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
    <div><h2 className="text-amber-50">{definition.name} +{item.level}</h2><p className="mt-1 text-sm text-stone-300">
     {artifactSlots[definition.slot]} · {statLabels[definition.mainStat.kind]} {formatWeaponStat(definition.mainStat,item.level+1)}
    </p></div>
    <a href="#/artifacts" className="text-sm text-amber-100 underline underline-offset-4">前往圣遗物培养</a>
   </div>}
  </div>
  <section className="rounded-2xl border border-amber-100/15 bg-[#142a31]/90 p-4 sm:p-6">
   <h2 className="text-sm font-medium text-amber-50">元素晶石</h2>
   {crystals.length===0?<p className="mt-3 text-sm text-stone-400">暂无晶石，可通过关卡挑战获取。</p>:
    <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
     {crystals.map(crystal=><li key={crystal.id} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1.5 text-center">
      <ElementalCrystalIcon crystal={crystal} size={34}/>
      <span className="text-xs" style={{color:crystalRarities[crystal.rarity].color}}>{crystal.name}</span>
      <span className="text-xs tabular-nums text-stone-200">×{profile.crystals[crystal.id]}</span>
     </li>)}
    </ul>}
  </section>
 </section>;
}
