import type {Profile} from '../../objects/Profile';
import type {ArchiveFilter} from './objects/ArchiveFilter';
import {useArchive} from './hooks/useArchive';
import {CharacterEntries} from './components/CharacterEntries';
import {WeaponEntries} from './components/WeaponEntries';
import {CharacterFilterControls} from '../../components/ui/CharacterFilterControls';
import {CharacterPageControls} from '../../components/ui/CharacterPageControls';
export function ArchivePage({profile}:{profile:Profile}){
 const page=useArchive(profile);
 const empty=page.tab==='characters'?page.characters.length+page.characterReferences.length===0:page.weapons.length===0;
 return <section className="space-y-7">
  <header><p className="text-xs tracking-[.3em] text-amber-100/50">TEYVAT ARCHIVE</p><h1 className="mt-4 font-serif text-4xl text-amber-50">图鉴</h1><p className="mt-4 text-sm leading-7 text-stone-400">收录当前版本全部角色与武器。未解锁角色以黑色剪影显示，仍可查看基础属性与招式说明。</p><p className="mt-3 text-sm text-amber-100">角色收集 {page.characterCount} / {page.characterTotal}<span className="mx-4 text-stone-600">|</span>武器收集 {page.weaponCount} / {page.weaponTotal}</p></header>
  <div className="flex flex-wrap items-center gap-3"><div data-tutorial-target="archive-tabs" role="tablist" aria-label="图鉴分类" className="flex gap-2">{([{id:'characters',label:'角色图鉴'},{id:'weapons',label:'武器图鉴'}] as const).map(tab=><button key={tab.id} role="tab" aria-selected={page.tab===tab.id} onClick={()=>page.setTab(tab.id)} className={page.tab===tab.id?'rounded-full bg-amber-100 px-5 py-2.5 text-sm text-slate-900':'rounded-full border border-white/15 px-5 py-2.5 text-sm text-stone-400'}>{tab.label}</button>)}</div><input aria-label="搜索图鉴" placeholder="搜索名称、元素、武器或天赋…" value={page.search} onChange={e=>page.setSearch(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-amber-100/50"/><select aria-label="解锁状态" value={page.filter} onChange={e=>page.setFilter(e.target.value as ArchiveFilter)} className="rounded-xl border border-white/15 bg-[#182a31] px-4 py-2.5 text-sm"><option value="all">全部</option><option value="unlocked">已解锁</option><option value="locked">未解锁</option></select></div>
  {page.tab==='characters'&&<div className="flex flex-wrap items-center justify-between gap-3">
   <CharacterFilterControls value={page.characterFilter} onChange={page.setCharacterFilter}/>
   <p className="text-xs text-stone-400" aria-live="polite">共 {page.matchCount} 位角色</p>
  </div>}
  {empty?<p className="rounded-2xl border border-white/10 p-10 text-center text-stone-400">没有符合条件的条目，试试其他关键词或解锁状态。</p>:page.tab==='characters'?<CharacterEntries entries={page.characters} references={page.characterReferences}/>:<WeaponEntries entries={page.weapons}/>}
  {page.tab==='characters'&&<CharacterPageControls index={page.pageIndex} count={page.pageCount} onChange={page.setIndex}/>}
 </section>;
}
