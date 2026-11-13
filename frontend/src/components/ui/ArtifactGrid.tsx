import {artifacts,artifactRarities,type OwnedArtifact,type ArtifactDefinition} from '../../objects/Artifact';
import {gameAsset} from '../../system/gameAsset';

export function ArtifactIcon({definition,className,silhouette=false}:{definition:ArtifactDefinition;className?:string;silhouette?:boolean}){
 return <img src={gameAsset('/artifacts/'+definition.id+'.png')} alt="" draggable={false} className={'object-contain [image-rendering:pixelated] '+(silhouette?'brightness-0 ':'')+(className??'')}/>;
}

export function ArtifactGrid({items,selected,onSelect,minSlots=0}:{items:readonly OwnedArtifact[];selected?:string;onSelect:(id:string)=>void;minSlots?:number}){
 return <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 sm:gap-3 lg:grid-cols-10">
  {items.map(item=>{
   const definition=artifacts.find(entry=>entry.id===item.artifactId);
   if(!definition)return null;
   return <button key={item.id} type="button" title={definition.name} aria-label={`${definition.name} +${item.level}`} aria-pressed={selected===item.id}
    onClick={()=>onSelect(item.id)} style={{borderBottomColor:artifactRarities[definition.rarity].color}}
    className="relative grid aspect-square min-w-0 place-items-center rounded-md border border-b-2 border-white/15 bg-[#243b40] p-1 hover:bg-[#304b50] aria-pressed:border-amber-100 aria-pressed:bg-[#304b50]">
    <ArtifactIcon definition={definition} className="h-full w-full"/>
    <span className="absolute bottom-0.5 right-1 rounded bg-slate-950/65 px-1 text-[10px] text-stone-100">+{item.level}</span>
   </button>;
  })}
  {Array.from({length:Math.max(0,minSlots-items.length)},(_,index)=><div key={index} aria-hidden="true" className="aspect-square rounded-md border border-white/10 bg-slate-950/25 shadow-inner"/>)}
 </div>;
}
