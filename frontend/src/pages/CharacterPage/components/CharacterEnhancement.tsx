import type {Character} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {equippedArtifactLoadout,equippedCharacterStats} from '../../../game/functions/artifactStats';
import {equippedWeaponLoadout} from '../../../game/functions/weaponInventory';
import {attackPatternLabels} from '../../../objects/AttackPattern';
import {attackStyleLabels} from '../../../objects/AttackStyle';
import {characterAscensions,characterLevelLimit} from '../../../objects/CharacterAscension';
import {crystalRarities,elementalCrystal} from '../../../objects/ElementalCrystal';
import {ElementalCrystalIcon} from '../../../components/ui/ElementalCrystalIcon';
import {bossHuntHref} from '../../StagesPage/paths';

export function CharacterEnhancement({profile,character,onLevel,onAscend,pending}:{profile:Profile;character:Character;onLevel:()=>void;onAscend:()=>void;pending:boolean}){
 const owned=profile.characters.find(c=>c.id===character.id),level=owned?.level??1;
 const ascension=owned?.ascension??0;
 const limit=characterLevelLimit(character.maxLevel,ascension);
 const nextAscension=characterAscensions[ascension];
 const requirement=nextAscension&&owned?.level===nextAscension.level&&nextAscension.level<character.maxLevel?nextAscension:null;
 const crystal=requirement?elementalCrystal(character.element,requirement.rarity):null;
 const crystalCount=crystal?(profile.crystals[crystal.id]??0):0;
 const needsAscension=requirement!==null;
 const hasMaterials=requirement!==null&&crystalCount>=requirement.amount;
 const canLevel=level<limit;
 const maxed=level>=character.maxLevel;
 const loadout=equippedWeaponLoadout(profile,character);
 const artifactLoadout=equippedArtifactLoadout(profile,character.id);
 const statsAt=(value:number)=>equippedCharacterStats(character,value,loadout,artifactLoadout);
 const stats=statsAt(level),next=statsAt(Math.min(limit,level+1));
 return <section className="flex flex-1 flex-col">
  <header><h2 className="font-serif text-3xl text-amber-50">角色强化</h2><p className="mt-3 text-sm text-stone-300">{character.name} · Lv.{level} / {limit}{canLevel&&<span className="ml-3 text-emerald-200">→ Lv.{level+1}</span>}</p></header>
  <div className="mt-6 grid gap-4 sm:grid-cols-2">{[{label:'开局攻击',value:stats.attack,next:next.attack},{label:'生命上限',value:stats.maxHp,next:next.maxHp}].map(stat=><div key={stat.label} className="rounded-xl bg-white/5 p-5"><p className="text-xs text-stone-400">{stat.label}</p><p className="mt-3 text-2xl text-amber-100">{stat.value}{canLevel&&<span className="ml-3 text-lg text-emerald-200">→ {stat.next}</span>}</p>{canLevel&&<p className="mt-2 text-xs text-emerald-200">提升 +{Math.round((stat.next-stat.value)*100)/100}</p>}</div>)}</div>
  <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-stone-400">攻击类型</dt><dd className="mt-1 text-stone-200">{attackStyleLabels[character.attackStyle]} · {attackPatternLabels[character.attackPattern.kind]}</dd></div><div><dt className="text-xs text-stone-400">射程 / 攻击间隔</dt><dd className="mt-1 text-stone-200">{stats.attackRange} / {(stats.attackIntervalTicks/20).toFixed(2)}秒</dd></div><div><dt className="text-xs text-stone-400">角色攻击</dt><dd className="mt-1 text-stone-200">{character.attackVisual.name}</dd></div><div><dt className="text-xs text-stone-400">装备武器</dt><dd className="mt-1 text-stone-200">{loadout?loadout.definition.name+' · Lv.'+loadout.level:'无'}</dd></div></dl>
  {crystal&&requirement&&<div className="mt-6 rounded-xl border border-white/10 bg-slate-950/20 px-4 py-3">
   <div className="flex flex-wrap items-baseline justify-between gap-2">
    <h3 className="text-sm font-medium text-amber-50">突破 {ascension} / {characterAscensions.length}</h3>
    <p className="text-xs text-stone-300">突破后上限为 Lv.{characterLevelLimit(character.maxLevel,ascension+1)}</p>
   </div>
   <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
    <div className="flex items-center gap-2 text-sm">
     <ElementalCrystalIcon crystal={crystal} size={24}/>
     <span style={{color:crystalRarities[crystal.rarity].color}}>{crystal.name}</span>
     <span className={'tabular-nums '+(crystalCount<requirement.amount?'text-rose-200':'text-stone-200')} aria-label="已拥有晶石 / 所需晶石">{crystalCount} / {requirement.amount}</span>
    </div>
    <a href={bossHuntHref} className="text-xs text-amber-100 underline underline-offset-4">前往首领征讨</a>
   </div>
  </div>}
  <div className="mt-auto pt-7">
   <p className="text-xs leading-6 text-stone-400">属性包含武器和圣遗物加成，强化将在下次出战生效。局内升级只在本次试炼中生效。</p>
   <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
    <span className="text-sm text-amber-100">{maxed?'已达到培养上限':needsAscension?'达到当前等级上限':character.levelUpCost+' 摩拉 / 级'}</span>
    <button type="button" disabled={pending||!owned||(needsAscension?!hasMaterials:!canLevel||profile.mora<character.levelUpCost)}
     onClick={needsAscension?onAscend:onLevel} className="rounded-full bg-amber-100 px-7 py-3 text-sm text-slate-900 disabled:opacity-40">
     {maxed?'已满级':needsAscension?'突破':'提升等级'}
    </button>
   </div>
  </div>
 </section>;
}
