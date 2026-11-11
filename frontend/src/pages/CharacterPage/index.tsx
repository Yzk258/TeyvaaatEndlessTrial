import {CharacterRoster,type CharacterRosterProps} from './components/CharacterRoster';

export function CharacterPage(p:CharacterRosterProps){
  return <div className="space-y-8">
    <header><p className="text-xs tracking-[.3em] text-amber-100/50">CHARACTER DEVELOPMENT</p><h1 className="mt-4 font-serif text-4xl text-amber-50">角色培养</h1><p className="mt-4 text-sm leading-7 text-stone-400">选择已拥有的角色进行强化或更换武器。出战选择会记录在当前存档。</p></header>
    <CharacterRoster {...p}/>
    <a href="#/camp" className="inline-block rounded-full border border-amber-100/30 px-6 py-3 text-sm text-amber-100">返回营地，准备出战 →</a>
  </div>;
}
