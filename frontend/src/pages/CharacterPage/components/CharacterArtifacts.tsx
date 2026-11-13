import {ArtifactIcon} from '../../../components/ui/ArtifactGrid';
import {artifactSetBonuses,equippedArtifactLoadout} from '../../../game/functions/artifactStats';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
import {artifacts,artifactSlotIds,artifactSlots,artifactSets,type ArtifactSlot} from '../../../objects/Artifact';
import type {Character} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {statLabels} from '../../../objects/Weapon';

export function CharacterArtifacts({profile,character,pending,onEquipArtifact}:{
 profile:Profile;character:Character;pending:boolean;onEquipArtifact:(slot:ArtifactSlot,id:string|null)=>void;
}){
 const loadout=equippedArtifactLoadout(profile,character.id);
 const bonuses=artifactSetBonuses(loadout);
 const owned=profile.characters.some(item=>item.id===character.id);
 const wearers=new Map(profile.artifactEquipment.map(entry=>[entry.artifactInstanceId,entry.characterId]));
 const inventory=profile.artifacts.flatMap(item=>{
  const definition=artifacts.find(entry=>entry.id===item.artifactId);
  return definition?[{item,definition,wearer:wearers.get(item.id)}]:[];
 });

 return <section>
  <h2 className="font-serif text-3xl text-amber-50">圣遗物装备</h2>
  <p className="mt-3 text-sm text-stone-300">{character.name} · 已装备 {loadout.length} / {artifactSlotIds.length}</p>
  <ul className="mt-5 space-y-2">{artifactSlotIds.map(slot=>{
   const available=inventory.filter(entry=>entry.definition.slot===slot&&(!entry.wearer||entry.wearer===character.id));
   const equipped=available.find(entry=>entry.wearer===character.id);
   return <li key={slot} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3">
    <div className="grid size-12 shrink-0 place-items-center rounded-md bg-slate-950/30">
     {equipped&&<ArtifactIcon definition={equipped.definition} className="size-11"/>}
    </div>
    <div className="min-w-24 flex-1"><p className="text-sm text-amber-50">{artifactSlots[slot]}</p>
     {equipped&&<p className="mt-1 text-xs text-stone-300">{statLabels[equipped.definition.mainStat.kind]} {formatWeaponStat(equipped.definition.mainStat,equipped.item.level+1)}</p>}
    </div>
    <select aria-label={artifactSlots[slot]} value={equipped?.item.id??''} disabled={pending||!owned||available.length===0}
     onChange={event=>onEquipArtifact(slot,event.target.value||null)} className="w-full min-w-0 rounded-lg border border-white/15 bg-[#182a31] px-2 py-2 text-sm sm:w-auto">
     <option value="">{available.length===0?'暂无可装备的圣遗物':'空置'}</option>
     {available.map(({item,definition})=><option key={item.id} value={item.id}>{definition.name} +{item.level}</option>)}
    </select>
   </li>;
  })}</ul>
  <div className="mt-5 space-y-3 rounded-xl border border-emerald-100/15 p-4">
   <h3 className="text-sm text-amber-50">套装效果</h3>
   {Object.values(artifactSets).map(set=><div key={set.name} className="space-y-1 text-sm"><p className="text-stone-200">{set.name}</p>
    {set.bonuses.map(bonus=><p key={bonus.pieces} className={bonuses.includes(bonus)?'text-emerald-200':'text-stone-400'}>
     {bonus.pieces} 件套 · {bonus.kind==='attackPercent'?`攻击力 +${bonus.value}%`:`击败敌人回复 ${bonus.value}% 最大生命`} · {bonuses.includes(bonus)?'已激活':'未激活'}</p>)}
   </div>)}
  </div>
 </section>;
}
