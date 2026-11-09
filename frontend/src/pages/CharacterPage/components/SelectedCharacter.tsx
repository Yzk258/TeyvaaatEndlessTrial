import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {RarityBadge} from '../../../components/ui/RarityBadge';
import type {Character} from '../../../objects/Character';
import {elementLabels} from '../../../objects/Element';
import {weaponLabels} from '../../../objects/WeaponType';
import portraits from '../../../../../shared/character-portraits.json';
export function SelectedCharacter({character,level}:{character:Character;level:number|undefined}){
 return <article className="overflow-hidden rounded-2xl border border-amber-100/20 bg-[#142a31]/80 p-6">
  <p className="text-xs tracking-widest text-amber-100/60">当前选择 · {level?'Lv.'+level:'未获得'}</p>
  <CharacterPortrait characterId={character.id} label={character.name+'半身立绘'} framing="bust" allowReference className="my-5 h-64 w-full"/>
  <RarityBadge rarity={character.rarity}/><h2 className="mt-3 font-serif text-4xl text-amber-50">{character.name}</h2><p className="mt-3 text-sm text-stone-300">{character.title}</p><p className="mt-2 text-xs text-stone-400">{elementLabels[character.element]} · {weaponLabels[character.weapon]}</p>
  {!Object.hasOwn(portraits,character.id)&&<p className="mt-4 text-xs text-amber-100/60">原图占位 · 像素立绘待设计</p>}
 </article>;
}
