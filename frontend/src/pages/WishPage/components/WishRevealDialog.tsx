import {RarityBadge} from '../../../components/ui/RarityBadge';
import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import type {WishReveal} from '../objects/WishReveal';
import {useWishAnimation} from '../hooks/useWishAnimation';
import {WishSky} from './WishSky';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {characters} from '../../../objects/Character';
import {weapons,statLabels} from '../../../objects/Weapon';
import {elementLabels} from '../../../objects/Element';
import {weaponLabels} from '../../../objects/WeaponType';
import {formatWeaponStat} from '../../../game/functions/weaponStats';
import {WishBatchReveal} from './WishBatchReveal';
export function WishRevealDialog({result:reveal,onClose}:{result:WishReveal;onClose:()=>void}){
 const {phase,dialog,skip,revealImmediately}=useWishAnimation(reveal.pulls.length);
 const [first]=reveal.pulls;
 const result={...first.reward,duplicate:first.duplicate};
 const character=result.kind==='character'?characters.find(c=>c.id===result.id):undefined;
 const weapon=result.kind==='weapon'?weapons.find(w=>w.id===result.id):undefined;
 const title=character?.name??weapon?.name??'新的相遇';
 return <dialog ref={dialog} onCancel={event=>{event.preventDefault();if(phase==='reveal')onClose();else skip();}} aria-labelledby="wish-reveal-title" className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-[#080f20] p-0 text-stone-100 backdrop:bg-slate-950/95">
  <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
   <WishSky phase={phase} rarities={reveal.pulls.map(({reward})=>reward.rarity)}/>
   <div className="absolute inset-x-0 top-8 z-10 flex items-center justify-between px-6 md:px-12"><span className="text-xs tracking-[.3em] text-amber-100/50">提瓦特 · 祈愿</span>{phase!=='reveal'&&<button autoFocus onClick={skip} className="rounded-full border border-white/20 bg-slate-950/30 px-5 py-2 text-sm text-stone-300 hover:bg-white/10">跳过动画 →</button>}</div>
   {phase!=='reveal'?
    <div className="relative z-10 mt-56 text-center" role="status">
     <h2 id="wish-reveal-title" className="font-serif text-2xl tracking-[.3em] text-amber-50">{phase==='gathering'?'星光汇聚':'命运正在交汇'}</h2>
     <p className="mt-4 text-xs tracking-[.2em] text-indigo-100/40">循着星光，迎接新的相遇</p>
    </div>:
    reveal.pulls.length>1?<WishBatchReveal pulls={reveal.pulls} animate={!revealImmediately} onClose={onClose}/>:
    <section className={'relative z-10 flex w-full max-w-lg flex-col items-center text-center '+(revealImmediately?'':'animate-wish-reveal motion-reduce:animate-none')}>
     <p className="text-xs tracking-[.4em] text-amber-100/60">{result.kind==='character'?'与你相遇':'星光铸成'}</p>
     <div className="relative my-7 flex h-60 w-60 items-center justify-center">
      <div className="absolute inset-3 rotate-45 rounded-3xl border border-amber-100/15 bg-amber-100/[.02]"/>
      {character?<CharacterPortrait characterId={character.id} label={character.name+'像素形象'} className="relative h-56 w-44"/>:
       weapon?<WeaponPortrait weaponId={weapon.id} label={weapon.name} className="relative h-56 w-56"/>:
       <span aria-hidden="true" className="relative font-serif text-[120px] text-amber-100">✧</span>}
     </div>
     <p className="mb-3 rounded-full border border-amber-100/20 bg-amber-100/5 px-4 py-1 text-xs text-amber-100">{result.duplicate?'重复获得':result.kind==='character'?'新伙伴':'新武器'}</p>
     <RarityBadge rarity={result.rarity}/>
     <h2 id="wish-reveal-title" className="mt-3 font-serif text-5xl tracking-widest text-amber-50">{title}</h2>
     <p className="mt-4 text-sm text-indigo-100/60">{character?elementLabels[character.element]+' · '+weaponLabels[character.weapon]+' · '+character.title:weapon?weaponLabels[weapon.weapon]:''}</p>
     {weapon&&<p className="mt-4 text-sm text-stone-300">{statLabels[weapon.mainStat.kind]} {formatWeaponStat(weapon.mainStat,1)}<span className="mx-3 text-stone-600">/</span>{statLabels[weapon.subStat.kind]} {formatWeaponStat(weapon.subStat,1)}</p>}
     <p className="mt-6 text-sm text-stone-400">{result.duplicate?(result.kind==='character'?'角色印记 +1':'武器重复记录 +1'):(result.kind==='character'?'已加入你的冒险队伍':'已收入你的武器收藏')}</p>
     <button autoFocus onClick={onClose} className="mt-9 rounded-full bg-[#e8dbc2] px-12 py-3 text-sm font-medium text-[#243630] transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">继续冒险</button>
    </section>}
  </div>
 </dialog>;
}
