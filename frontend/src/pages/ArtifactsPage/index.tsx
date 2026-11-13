import {useState} from 'react';
import {ArtifactGrid,ArtifactIcon} from '../../components/ui/ArtifactGrid';
import {formatWeaponStat} from '../../game/functions/weaponStats';
import {artifacts,artifactRarities,artifactSets,artifactSlots} from '../../objects/Artifact';
import {characters} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';
import {statLabels} from '../../objects/Weapon';

export function ArtifactsPage({profile,pending,onLevelArtifact}:{profile:Profile;pending:boolean;onLevelArtifact:(id:string)=>void}){
 const [selected,setSelected]=useState<string>();
 const item=profile.artifacts.find(entry=>entry.id===selected)??profile.artifacts[0];
 const definition=artifacts.find(entry=>entry.id===item?.artifactId);
 const equipment=profile.artifactEquipment.find(entry=>entry.artifactInstanceId===item?.id);
 const wearer=characters.find(entry=>entry.id===equipment?.characterId);
 const rarity=definition?artifactRarities[definition.rarity]:null;

 return <section className="max-w-4xl space-y-5">
  <header><h1 className="font-serif text-4xl text-amber-50">圣遗物培养</h1><p className="mt-3 text-sm text-stone-300">消耗摩拉提升主词条。在角色培养的「圣遗物」栏更换装备。</p></header>
  <div data-tutorial-target="artifact-training" className="rounded-2xl border border-amber-100/15 bg-[#142a31]/90 p-4 sm:p-6">
   <ArtifactGrid items={profile.artifacts} selected={item?.id} onSelect={setSelected} minSlots={10}/>
  </div>
  {definition&&item&&rarity?<article className="rounded-2xl border border-amber-100/15 bg-[#142a31]/90 p-5 sm:p-7">
   <div className="flex flex-wrap items-center gap-5">
    <ArtifactIcon definition={definition} className="size-24 rounded-lg bg-white/5 p-2"/>
    <div><p className="text-xs text-stone-300">{artifactSlots[definition.slot]} · {rarity.label}色 · +{item.level} / +{rarity.maxLevel}</p>
     <h2 className="mt-2 font-serif text-2xl text-amber-50">{definition.name}</h2>{wearer&&<p className="mt-2 text-sm text-emerald-200">{wearer.name}装备中</p>}</div>
   </div>
   <dl className="mt-5 rounded-xl bg-white/5 p-4"><dt className="text-xs text-stone-300">主词条 · {statLabels[definition.mainStat.kind]}</dt>
    <dd className="mt-2 text-xl text-amber-100">{formatWeaponStat(definition.mainStat,item.level+1)}
     {item.level<rarity.maxLevel&&<span className="ml-3 text-emerald-200">→ {formatWeaponStat(definition.mainStat,item.level+2)}</span>}</dd></dl>
   <ul className="mt-5 space-y-2 text-sm text-stone-300" aria-label={artifactSets[definition.setId].name+'套装效果'}>
    {artifactSets[definition.setId].bonuses.map(bonus=><li key={bonus.pieces}>{bonus.pieces} 件套 · {bonus.kind==='attackPercent'?`攻击力 +${bonus.value}%`:`击败敌人回复 ${bonus.value}% 最大生命`}</li>)}
   </ul>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
    <span className="text-sm text-amber-100">{item.level>=rarity.maxLevel?'已达到等级上限':`${definition.levelUpCost} 摩拉 / 级`}</span>
    <button type="button" disabled={pending||item.level>=rarity.maxLevel||profile.mora<definition.levelUpCost} onClick={()=>onLevelArtifact(item.id)}
     className="rounded-full bg-amber-100 px-6 py-2.5 text-sm text-slate-900 disabled:opacity-40">强化圣遗物</button>
   </div>
  </article>:<p className="text-sm text-stone-300">尚未拥有圣遗物。</p>}
 </section>;
}
