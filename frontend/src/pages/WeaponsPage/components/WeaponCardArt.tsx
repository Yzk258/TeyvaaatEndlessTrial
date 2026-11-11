import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {WeaponPortrait} from '../../../components/ui/WeaponPortrait';
import type {Character} from '../../../objects/Character';
import type {Weapon} from '../../../objects/Weapon';

export function WeaponCardArt({weapon,equippedBy,large=false,silhouette=false}:{weapon:Weapon;equippedBy:Character|undefined;large?:boolean;silhouette?:boolean}){
 return <div className={large?'relative my-5':'relative my-3'}>
  <WeaponPortrait weaponId={weapon.id} label={weapon.name+'像素形象'} silhouette={silhouette} className={large?'h-64 w-full':'h-32 w-full'}/>
  {equippedBy&&<CharacterPortrait characterId={equippedBy.id} label={equippedBy.name+'装备中'} framing="bust" allowReference
   className={'pointer-events-none absolute bottom-0 right-0 rounded-xl border border-amber-100/20 bg-[#182a31]/90 p-1 '+(large?'size-24':'size-12')}/>}
 </div>;
}
