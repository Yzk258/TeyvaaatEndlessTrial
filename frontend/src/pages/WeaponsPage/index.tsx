import {useState} from 'react';
import {DevelopmentTabs} from '../../components/ui/DevelopmentTabs';
import {groupOwnedWeapons} from '../../game/functions/weaponInventory';
import type {Profile} from '../../objects/Profile';
import {weapons} from '../../objects/Weapon';
import {characters} from '../../objects/Character';
import {WeaponInventory} from './components/WeaponInventory';
import {WeaponDetails} from './components/WeaponDetails';
import {SelectedWeapon} from './components/SelectedWeapon';
export function WeaponsPage(p:{profile:Profile;onLevelWeapon:(weaponInstanceId:string)=>void;pending:boolean}){
 const [selectedWeapon,setSelectedWeapon]=useState<string|null>(null);
 const groups=groupOwnedWeapons(p.profile.weapons);
 const firstOwned=p.profile.weapons.find(item=>weapons.some(definition=>definition.id===item.weaponId));
 const owned=p.profile.weapons.find(item=>item.id===selectedWeapon)??firstOwned;
 const definition=weapons.find(weapon=>weapon.id===owned?.weaponId)??weapons[0];
 const instances=groups.get(definition.id)??[];
 const owners=new Map(p.profile.equipment.map(entry=>[entry.weaponInstanceId,characters.find(character=>character.id===entry.characterId)]));
 const enhancement=owned?<WeaponDetails {...p} owned={owned} definition={definition}/>:<div className="flex flex-1 flex-col items-start justify-center gap-5">
  <h2 className="font-serif text-3xl text-amber-50">武器强化</h2>
  <p className="text-sm leading-7 text-stone-400">尚未拥有武器，获取后即可在这里强化。</p>
  <a href="#/wishes" className="rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900">前往武器祈愿 →</a>
 </div>;
 return <section className="space-y-8">
  <header data-tutorial-target="weapon-intro"><p className="text-xs tracking-[.3em] text-amber-100/50">WEAPON WORKSHOP</p><h1 className="mt-4 font-serif text-4xl text-amber-50">武器培养</h1><p className="mt-4 text-sm leading-7 text-stone-400">选择武器，查看天赋和提升主副词条。装备可在角色培养的「武器」栏更换。</p><p className="mt-3 text-sm text-amber-100">武器收集 {weapons.filter(weapon=>groups.has(weapon.id)).length} / {weapons.length}</p></header>
  <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]">
   <SelectedWeapon definition={definition} owned={owned} instances={instances} owners={owners} onSelect={setSelectedWeapon} pending={p.pending}/>
   <DevelopmentTabs label="武器培养栏目" tabs={[
    {id:'enhancement',label:'强化',content:enhancement},
    {id:'refinement',label:'精炼',inDevelopment:true}
   ]}/>
  </div>
  <section><div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-serif text-2xl text-amber-50">武器列表</h2><p className="text-xs text-stone-400">未获得的武器可通过武器祈愿解锁</p></div><WeaponInventory groups={groups} owners={owners} selectedId={owned?.id} onSelect={setSelectedWeapon}/></section>
 </section>;
}
