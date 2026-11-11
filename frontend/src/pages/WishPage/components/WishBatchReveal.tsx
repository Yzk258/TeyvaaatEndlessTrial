import {useEffect,useRef} from 'react';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {RarityBadge} from '../../../components/ui/RarityBadge';
import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import {characters} from '../../../objects/Character';
import type {Rarity} from '../../../objects/Rarity';
import {weapons} from '../../../objects/Weapon';
import type {WishPulls} from '../../../objects/WishReward';

const cardColors:Readonly<Record<Rarity,string>>={
 3:'border-sky-200/20 from-sky-300/15',
 4:'border-violet-200/45 from-violet-400/30',
 5:'border-amber-200/65 from-amber-400/35'
};

export function WishBatchReveal({pulls,animate,onClose}:{pulls:WishPulls;animate:boolean;onClose:()=>void}){
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
 return <section className="relative z-10 my-8 flex w-full max-w-5xl flex-col items-center text-center">
  <h2 id="wish-reveal-title" ref={heading} tabIndex={-1} className="font-serif text-3xl tracking-[.15em] text-amber-50 outline-none sm:text-4xl">十连祈愿结果</h2>
  <ol aria-label="获得的奖励" className="my-7 grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
   {pulls.map(({reward,duplicate},index)=>{
    const name=(reward.kind==='character'?characters:weapons).find(item=>item.id===reward.id)?.name??reward.id;
    const status=duplicate?'重复获得':reward.kind==='character'?'新伙伴':'新武器';
    return <li key={index} className={'min-w-0 rounded-xl border bg-gradient-to-b to-[#10192b] px-2 py-3 '+cardColors[reward.rarity]+(animate?' animate-wish-reveal motion-reduce:animate-none':'')}
     style={animate?{animationDelay:index*65+'ms'}:undefined}>
     {reward.kind==='character'?
      <CharacterPortrait characterId={reward.id} label={name+'立绘'} framing="bust" className="h-24 w-full sm:h-28"/>:
      <WeaponPortrait weaponId={reward.id} label={name+'像素形象'} className="h-24 w-full sm:h-28"/>}
     <div className="mt-2"><RarityBadge rarity={reward.rarity}/></div>
     <p className="mt-1 break-words text-sm font-medium text-amber-50">{name}</p>
     <p className="mt-1 text-[11px] text-stone-300">{status}</p>
    </li>;
   })}
  </ol>
  <button type="button" onClick={onClose} className="rounded-full bg-[#e8dbc2] px-12 py-3 text-sm font-medium text-[#243630] transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">继续冒险</button>
 </section>;
}
