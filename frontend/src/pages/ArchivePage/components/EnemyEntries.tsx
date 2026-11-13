import {EnemySprite,enemySprites} from '../../../components/ui/EnemySprite';
import {enemyDefinitions} from '../../../game/objects/Enemy';

export function EnemyEntries({query}:{query:string}){
 const entries=enemySprites.map(sprite=>{
  const definition=enemyDefinitions[sprite.kind];
  const attackLabel=definition.attack.kind==='ranged'?'远程':'近战';
  const rank=sprite.kind==='elite'?'精英':sprite.kind==='boss'?'首领':'普通';
  return {sprite,definition,attackLabel,rank};
 }).filter(({sprite,attackLabel,rank})=>`${sprite.name} ${attackLabel} ${rank}`.includes(query.trim()));

 if(entries.length===0)return <p className="rounded-2xl border border-white/10 bg-[#142a31]/75 p-8 text-center text-stone-300">没有符合条件的怪物。</p>;

 return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {entries.map(({sprite,definition,attackLabel,rank})=><article key={sprite.kind} className="min-w-0 overflow-hidden rounded-2xl border border-amber-100/15 bg-[#142a31]/85">
   <div className="flex h-36 items-center justify-center border-b border-white/10 bg-[#203a3c] p-3">
    <EnemySprite sprite={sprite} className="size-28 shrink-0"/>
   </div>
   <div className="p-4">
    <p className="text-xs text-stone-300">{rank} · {attackLabel}</p>
    <h2 className="mt-1 font-serif text-xl text-amber-50">{sprite.name}</h2>
    <dl className="mt-4 grid grid-cols-3 gap-2 text-sm tabular-nums">
     <div><dt className="text-xs text-stone-400">基础生命</dt><dd className="mt-1 text-amber-100">{definition.hp}</dd></div>
     <div><dt className="text-xs text-stone-400">基础伤害</dt><dd className="mt-1 text-amber-100">{definition.damage}</dd></div>
     <div><dt className="text-xs text-stone-400">击败经验</dt><dd className="mt-1 text-amber-100">{definition.experience}</dd></div>
    </dl>
   </div>
  </article>)}
 </div>;
}
