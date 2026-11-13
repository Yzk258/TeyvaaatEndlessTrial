import type {Profile} from '../../objects/Profile';
import type {ArchiveFilter} from './objects/ArchiveFilter';
import {useArchive} from './hooks/useArchive';
import {CharacterEntries} from './components/CharacterEntries';
import {WeaponEntries} from './components/WeaponEntries';
import {EnemyEntries} from './components/EnemyEntries';
import {ArtifactEntries} from './components/ArtifactEntries';
import {CharacterFilterControls} from '../../components/ui/CharacterFilterControls';
import {CharacterPageControls} from '../../components/ui/CharacterPageControls';

const tabs=[
 {id:'characters',label:'角色图鉴'},
 {id:'weapons',label:'武器图鉴'},
 {id:'enemies',label:'怪物图鉴'},
 {id:'artifacts',label:'圣遗物图鉴'}
] as const;

export function ArchivePage({profile,favoriteCharacters,pending,onFavorite}:{profile:Profile;favoriteCharacters:readonly string[];pending:boolean;onFavorite:(id:string,favorite:boolean)=>void}){
 const page=useArchive(profile,favoriteCharacters);
 const enemyTab=page.tab==='enemies';
 const characterTab=page.tab==='characters';
 const artifactTab=page.tab==='artifacts';
 const empty=characterTab?page.characters.length+page.characterReferences.length===0:artifactTab?page.artifacts.length===0:page.weapons.length===0;
 const searchPlaceholder=enemyTab?'搜索怪物名称或类型…':artifactTab?'搜索圣遗物名称、部位或套装…':'搜索名称、元素、武器或天赋…';
 return <section className="space-y-7">
  <header>
   <h1 className="font-serif text-4xl text-amber-50">图鉴</h1>
   <p className="mt-4 text-sm leading-7 text-stone-400">查看角色、武器、怪物和圣遗物的资料。未获得的角色、武器和圣遗物以黑色剪影显示。</p>
   <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-amber-100"><span>角色收集 {page.characterCount} / {page.characterTotal}</span>
    <span>武器收集 {page.weaponCount} / {page.weaponTotal}</span><span>圣遗物收集 {page.artifactCount} / {page.artifactTotal}</span></p>
  </header>
  <div className="flex flex-wrap items-center gap-3">
   <div data-tutorial-target="archive-tabs" role="group" aria-label="图鉴分类" className="flex flex-wrap gap-2">
    {tabs.map(tab=><button key={tab.id} type="button" aria-pressed={page.tab===tab.id} onClick={()=>page.setTab(tab.id)}
     className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-stone-300 aria-pressed:border-amber-100 aria-pressed:bg-amber-100 aria-pressed:text-slate-900 sm:px-5">{tab.label}</button>)}
   </div>
   <input aria-label={enemyTab?'搜索怪物':artifactTab?'搜索圣遗物':'搜索图鉴'} placeholder={searchPlaceholder} value={page.search}
    onChange={event=>page.setSearch(event.target.value)} className="min-w-40 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-amber-100/50"/>
   {!enemyTab&&<select aria-label="解锁状态" value={page.filter} onChange={event=>page.setFilter(event.target.value as ArchiveFilter)}
    className="rounded-xl border border-white/15 bg-[#182a31] px-4 py-2.5 text-sm">
    <option value="all">全部</option><option value="unlocked">已解锁</option><option value="locked">未解锁</option>
   </select>}
  </div>
  {characterTab&&<div className="flex flex-wrap items-center justify-between gap-3">
   <CharacterFilterControls value={page.characterFilter} onChange={page.setCharacterFilter}/>
   <p className="text-xs text-stone-400" aria-live="polite">共 {page.matchCount} 位角色</p>
  </div>}
  {enemyTab?<EnemyEntries query={page.search}/>:empty?
   <p className="rounded-2xl border border-white/10 p-10 text-center text-stone-400">没有符合条件的条目，试试其他关键词或解锁状态。</p>:
   characterTab?<CharacterEntries entries={page.characters} references={page.characterReferences} pending={pending} onFavorite={(id,favorite)=>{
    onFavorite(id,favorite);
    if(favorite)page.setIndex(0);
   }}/>:artifactTab?<ArtifactEntries entries={page.artifacts}/>:<WeaponEntries entries={page.weapons}/>}
  {characterTab&&<CharacterPageControls index={page.pageIndex} count={page.pageCount} onChange={page.setIndex}/>}
 </section>;
}
