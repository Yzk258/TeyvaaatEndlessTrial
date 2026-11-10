import {useState} from 'react';
import type {Profile} from '../../objects/Profile';
import {weapons} from '../../objects/Weapon';
import {characters} from '../../objects/Character';
import {WeaponInventory} from './components/WeaponInventory';
import {WeaponDetails} from './components/WeaponDetails';
import {SelectedWeapon} from './components/SelectedWeapon';
export function WeaponsPage(p:{profile:Profile;selected:string;onLevelWeapon:(id:string)=>void;onEquipWeapon:(characterId:string,weaponId:string|null)=>void;pending:boolean}){
 const [selectedWeapon,setSelectedWeapon]=useState<string|null>(null);
 const firstOwned=p.profile.weapons.find(w=>weapons.some(definition=>definition.id===w.id));
 const definition=weapons.find(w=>w.id===(selectedWeapon??firstOwned?.id))??weapons[0];
 const owned=p.profile.weapons.find(w=>w.id===definition.id);
 const equipped=p.profile.equipment.find(e=>e.weaponId===definition.id);
 const equippedBy=characters.find(c=>c.id===equipped?.characterId)?.name;
 return <section className="space-y-8">
  <header data-tutorial-target="weapon-intro"><p className="text-xs tracking-[.3em] text-amber-100/50">WEAPON WORKSHOP</p><h1 className="mt-4 font-serif text-4xl text-amber-50">武器培养</h1><p className="mt-4 text-sm leading-7 text-stone-400">选择武器，提升主副词条并为伙伴装备。词条与天赋将在下次试炼开局生效。</p><p className="mt-3 text-sm text-amber-100">武器收集 {weapons.filter(w=>p.profile.weapons.some(item=>item.id===w.id)).length} / {weapons.length}</p></header>
  <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]">
   <SelectedWeapon definition={definition} owned={owned} equippedBy={equippedBy}/>
   {owned?<WeaponDetails key={definition.id} {...p} owned={owned} definition={definition}/>:<section className="flex flex-col items-start justify-center gap-5 rounded-2xl border border-white/10 bg-[#142a31]/80 p-8"><h2 className="font-serif text-3xl text-amber-50">武器强化</h2><p className="text-sm leading-7 text-stone-400">尚未拥有武器，获取后即可在这里强化与装备。</p><a href="#/wishes" className="rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900">前往武器祈愿 →</a></section>}
  </div>
  <section><div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-serif text-2xl text-amber-50">武器列表</h2><p className="text-xs text-stone-400">未获得的武器可通过武器祈愿解锁</p></div><WeaponInventory profile={p.profile} selectedId={owned?.id} onSelect={setSelectedWeapon}/></section>
 </section>;
}
