import {ArtifactIcon} from '../../../components/ui/ArtifactGrid';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
import {artifactRarities,artifactSets,artifactSlots,type ArtifactDefinition} from '../../../objects/Artifact';
import {statLabels} from '../../../objects/Weapon';

export function ArtifactEntries({entries}:{entries:readonly {definition:ArtifactDefinition;quantity:number}[]}){
 return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {entries.map(({definition,quantity})=>{
   const rarity=artifactRarities[definition.rarity];
   return <article key={definition.id} aria-label={definition.name+(quantity?'，已获得':'，未获得')}
    className={'rounded-2xl border border-white/10 p-5 '+(quantity?'bg-[#142a31]/85':'bg-[#29424a]/75')}>
    <div className="flex items-center justify-between gap-2 text-xs text-stone-300">
     <span>{artifactSlots[definition.slot]} · {rarity.label}色</span><span>{quantity?'数量 '+quantity:'未获得'}</span>
    </div>
    <ArtifactIcon definition={definition} silhouette={quantity===0} className="mx-auto my-4 size-24"/>
    <h2 className="font-serif text-xl text-amber-50">{definition.name}</h2>
    <p className="mt-2 text-xs text-stone-300">{artifactSets[definition.setId].name}套装 · 强化上限 +{rarity.maxLevel}</p>
    <p className="mt-4 border-t border-white/10 pt-3 text-sm text-amber-100">+0 主词条 · {statLabels[definition.mainStat.kind]} {formatWeaponStat(definition.mainStat,1)}</p>
   </article>;
  })}
 </div>;
}
