import {useState} from 'react';
import {ArtifactGrid} from '../../components/ui/ArtifactGrid';
import {DismantleButton} from '../../components/ui/DismantleButton';
import {ElementalCrystalIcon} from '../../components/ui/ElementalCrystalIcon';
import {formatWeaponStat} from '../../game/functions/weaponStats';
import {equipmentUsage} from '../../game/functions/equipmentInventory';
import {artifacts,artifactSlots} from '../../objects/Artifact';
import type {Profile} from '../../objects/Profile';
import {crystalRarities,elementalCrystals} from '../../objects/ElementalCrystal';
import {statLabels} from '../../objects/Weapon';

const minimumVisibleSlots=40;

export function BagPage({profile,pending,onDismantleArtifact}:{profile:Profile;pending:boolean;onDismantleArtifact:(id:string)=>void}){
 const [selected,setSelected]=useState<string>();
 const item=profile.artifacts.find(entry=>entry.id===selected);
 const definition=artifacts.find(entry=>entry.id===item?.artifactId);
 const equipped=profile.artifactEquipment.some(entry=>entry.artifactInstanceId===item?.id);
 const crystals=elementalCrystals.filter(crystal=>(profile.crystals[crystal.id]??0)>0);
 return <section className="max-w-4xl space-y-5">
  <header>
   <h1 className="font-serif text-4xl text-amber-50">背包</h1>
  </header>
  <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="背包容量">
   {equipmentUsage(profile).map(({kind,label,count,capacity})=><div key={kind} className="rounded-xl border border-amber-100/15 bg-[#142a31]/90 px-4 py-3">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
     <span className="text-amber-50">{label}</span>
     <span className={'tabular-nums '+(count>capacity?'text-rose-200':'text-stone-300')}>{count} / {capacity}</span>
    </div>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
     {kind==='weapon'?<a href="#/weapons" className="text-amber-100 underline underline-offset-4">管理武器</a>:
      <a href="#/artifacts" className="text-amber-100 underline underline-offset-4">管理圣遗物</a>}
     {count>=capacity&&<span className="text-rose-200">{count===capacity?'容量已满':`超出 ${count-capacity} 件`}</span>}
    </div>
   </div>)}
  </div>
  <div className="rounded-2xl border border-amber-100/15 bg-[#142a31]/90 p-4 sm:p-6">
   <h2 className="mb-4 text-sm font-medium text-amber-50">圣遗物</h2>
   <ArtifactGrid items={profile.artifacts} selected={selected} onSelect={setSelected} minSlots={minimumVisibleSlots}/>
   {item&&definition&&<div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
    <div><h2 className="text-amber-50">{definition.name} +{item.level}</h2><p className="mt-1 text-sm text-stone-300">
     {artifactSlots[definition.slot]} · {statLabels[definition.mainStat.kind]} {formatWeaponStat(definition.mainStat,item.level+1)}
    </p></div>
    <DismantleButton label="圣遗物" equipped={equipped} pending={pending} onClick={()=>onDismantleArtifact(item.id)}/>
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
