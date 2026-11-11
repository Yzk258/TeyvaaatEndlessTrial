import {AdventureSetup,type AdventureSetupProps} from './components/AdventureSetup';
import {CharacterPortrait} from '../../components/ui/CharacterPortrait';
import {WeaponPortrait} from '../../components/ui/WeaponPortrait';
import {equippedWeaponLoadout} from '../../game/functions/weaponInventory';
import {defaultEndlessMapId,endlessMaps} from '../../objects/BattleMap';
import {characters,type CharacterId} from '../../objects/Character';
import type {Profile} from '../../objects/Profile';

export function HomePage({selected,profile,...setup}:{selected:CharacterId;profile:Profile}&AdventureSetupProps){
 const character=characters.find(entry=>entry.id===selected);
 const weapon=character?equippedWeaponLoadout(profile,character)?.definition:undefined;
 return <section className="max-w-4xl overflow-hidden rounded-3xl border border-emerald-100/15 bg-gradient-to-br from-[#264b41]/95 via-[#1c3435]/95 to-[#142731]/95">
  <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-b border-white/10 px-5 py-7 sm:px-8 sm:py-9">
   <div className="min-w-0 flex-1 basis-64">
    <p className="text-sm text-emerald-200/80">{endlessMaps[defaultEndlessMapId].title} · 区块探索</p>
    <h1 className="mt-2 font-serif text-4xl text-[#f2ead9] sm:text-5xl">无尽冒险</h1>
    <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">在无限地图上迎战不断增强的敌潮。倒下或主动撤离时，按击杀数和存活时间结算。</p>
   </div>
   {character&&<div className="flex max-w-full items-center gap-3 rounded-2xl border border-white/15 bg-[#12252c]/60 px-4 py-2.5">
    <div className="min-w-0">
     <p className="text-xs text-stone-300">当前出战</p>
     <a href="#/characters" className="mt-1 inline-flex items-baseline gap-1.5 text-base font-medium text-amber-100 hover:underline">
      {character.name}<span aria-hidden="true" className="text-xs">↗</span>
     </a>
    </div>
    <CharacterPortrait characterId={character.id} label={character.name+'半身立绘'} framing="bust" allowReference className="h-20 w-20 shrink-0"/>
    {weapon&&<WeaponPortrait weaponId={weapon.id} label={weapon.name+'武器立绘'} className="h-16 w-14 shrink-0"/>}
   </div>}
  </header>
  <div className="px-5 py-6 sm:px-8 sm:py-8"><AdventureSetup {...setup}/></div>
 </section>;
}
