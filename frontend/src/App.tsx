import {MenuMapBackground} from './components/ui/MenuMapBackground';
import {useBattlePresentation} from './pages/hooks/useBattlePresentation';
import {useState} from 'react';
import {WishRevealDialog} from './pages/WishPage/components/WishRevealDialog';
import {ArchivePage} from './pages/ArchivePage';
import {WeaponsPage} from './pages/WeaponsPage';
import {MessageDialog} from './components/ui/MessageDialog';
import {BookOpen,CalendarCheck,Compass,Flag,GraduationCap,LayoutDashboard,Shield,Sparkles,Swords,Tent,UserRound,Users} from 'lucide-react';
import {OverviewPage} from './pages/OverviewPage';
import {ActivitiesPage} from './pages/ActivitiesPage';
import {TutorialDialog} from './components/ui/TutorialDialog';
import {CurrencyIcon} from './components/ui/CurrencyIcon';
import {useAdventure} from './pages/hooks/useAdventure';
import {HomePage} from './pages/HomePage';
import {StagesPage} from './pages/StagesPage';
import {BattlePage} from './pages/BattlePage';
import {usePageNavigation} from './pages/hooks/usePageNavigation';
import {CharacterPage} from './pages/CharacterPage';
import {WishPage} from './pages/WishPage';
import {OpeningPage} from './pages/OpeningPage';
import {AccountPage} from './pages/AccountPage';
import {AdminPage} from './pages/AdminPage';
const NAV_ICONS:Readonly<Record<string,typeof Compass>>={overview:LayoutDashboard,camp:Tent,stages:Flag,characters:Users,weapons:Swords,archive:BookOpen,wishes:Sparkles,activities:CalendarCheck,account:UserRound,admin:Shield};
export function App(){
 const a=useAdventure();
 const navigation=usePageNavigation(a.currentUser?.role);
 const presentation=useBattlePresentation(a.run?.runId??null);
 const [enteredRevision,setEnteredRevision]=useState<number|null>(null);
 const [tutorialOpen,setTutorialOpen]=useState(false);
 const entered=enteredRevision!==null&&enteredRevision===a.authRevision;
 if(!entered||a.page.status==='unauthenticated')return <OpeningPage user={a.currentUser} authRevision={a.authRevision} status={a.page.status} pending={a.pending} initialLogin={enteredRevision!==null} message={a.notice||('message' in a.page?a.page.message:undefined)} onEnter={()=>setEnteredRevision(a.authRevision)} onRetry={a.retry} onLogin={a.onLogin} onRegister={a.onRegister}/>;
 if(presentation.battleVisible&&a.run)return <BattlePage key={a.run.runId} stage={a.run.stage} adventure={a.run.adventure??null} seed={a.run.seed} level={a.run.level} equippedWeapon={a.run.equippedWeapon} character={a.run.character} onSettle={a.onSettle} onAbandon={a.onAbandon} pending={a.pending} notice={a.notice}/>;
 return <div className="relative isolate animate-opening-main motion-reduce:animate-none min-h-screen font-sans text-stone-200 selection:bg-amber-100/30">
  <MenuMapBackground/>
  <div inert={presentation.transitioning} className={'transition-opacity duration-[350ms] motion-reduce:transition-none '+(presentation.transitioning?'pointer-events-none opacity-0':'opacity-100')}>
  <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col overflow-y-auto border-r border-white/8 bg-[#142129]/85 backdrop-blur-sm p-7 lg:flex">
   <div className="flex items-center gap-3 text-amber-100"><Compass size={30}/><div><p className="font-serif text-xl tracking-[.2em]">提瓦特</p><p className="mt-1 text-[9px] tracking-[.3em] text-stone-500">ENDLESS TRIAL</p></div></div>
   <p className="mb-4 mt-12 text-[10px] tracking-[.3em] text-stone-500">冒险手册 / JOURNAL</p>
   <nav className="space-y-2" aria-label="主导航">{navigation.pages.map(p=>{const Icon=NAV_ICONS[p.id]??Swords;return <a key={p.id} href={p.href} aria-current={navigation.current===p.id?'page':undefined} className={navigation.current===p.id?'block rounded-xl border border-amber-100/15 bg-amber-100/5 px-4 py-3 text-sm text-amber-100':'block rounded-xl px-4 py-3 text-sm text-stone-400 hover:bg-white/5'}><Icon className="mr-3 inline" size={16}/> {p.label}</a>;})}</nav>
   <div className="mt-auto pt-8 text-xs leading-6 text-stone-500"><Sparkles size={20} className="mb-3 text-amber-100/40"/>愿风指引你的道路。<br/>v0.1 · 课程初版</div>
  </aside>
  <main className="mx-auto max-w-[1500px] px-5 pb-8 lg:ml-60 lg:px-12">
   <header className="mb-9 flex min-h-24 flex-wrap items-center justify-between gap-4 border-b border-white/10 py-4">
    <div><span className="text-xs text-stone-500">{navigation.title}</span><p className="mt-1 text-sm text-stone-300">{a.currentUser?a.currentUser.nickname+'，欢迎归来':'欢迎来到提瓦特'}</p></div>
    <div className="flex flex-wrap items-center gap-4"><button onClick={()=>setTutorialOpen(true)} aria-haspopup="dialog" className="rounded-full border border-amber-100/30 px-4 py-2 text-xs text-amber-100 transition hover:bg-amber-100/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100"><GraduationCap size={14} className="mr-2 inline"/>教程</button>
    {a.page.status==='ready'&&<div className="flex flex-wrap items-center gap-4"><div className="flex gap-5 rounded-full border border-white/10 bg-white/[.02] px-5 py-2.5 text-sm"><span><CurrencyIcon kind="primogem" size={14} className="mr-2 inline"/>{a.page.profile.primogems}</span><span><CurrencyIcon kind="fate" size={14} className="mr-2 inline"/>{a.page.profile.intertwinedFates}</span><span><CurrencyIcon kind="mora" size={14} className="mr-2 inline"/>{a.page.profile.mora.toLocaleString()}</span></div><a href="#/account" className="text-xs text-amber-100">{a.currentUser?.isGuest?'体验档案 · 绑定账号':a.currentUser?.role==='admin'?'管理员':'普通用户'}</a>{a.currentUser&&!a.currentUser.isGuest&&<button disabled={a.pending||!!a.run} title={a.run?'请先退出或结束本局战斗':undefined} onClick={a.onLogout} className="text-xs text-stone-400 disabled:opacity-30">退出登录</button>}</div>}</div>
   </header>
   <nav className="mb-6 flex flex-wrap gap-2 lg:hidden" aria-label="主导航">{navigation.pages.map(p=><a key={p.id} href={p.href} aria-current={navigation.current===p.id?'page':undefined} className={navigation.current===p.id?'rounded-full bg-amber-100 px-4 py-2 text-sm text-slate-900':'rounded-full border border-white/15 px-4 py-2 text-sm'}>{p.label}</a>)}</nav>
   {a.notice&&<div role="status" className="mb-6 rounded-xl border border-amber-100/20 bg-amber-100/5 px-5 py-3 text-sm text-amber-100">{a.notice}</div>}
    <div key={navigation.current} className="animate-page-enter motion-reduce:animate-none">{a.page.status==='loading'?<p className="py-32 text-center text-stone-400">正在读取账号与冒险档案…</p>
   :a.page.status==='error'?<section className="mx-auto max-w-lg rounded-2xl border border-white/10 p-10 text-center"><h1 className="font-serif text-3xl text-amber-50">暂时无法连接</h1><p className="my-5 text-sm text-stone-400">{a.page.message}</p><button onClick={a.retry} className="rounded-full bg-amber-100 px-7 py-3 text-slate-900">重新连接</button></section>
   
     :navigation.current==='overview'?<OverviewPage profile={a.page.profile} currentUser={a.currentUser} selected={a.selected}/>
     :navigation.current==='account'&&a.currentUser?<AccountPage key={a.currentUser.id} user={a.currentUser} pending={a.pending} onBind={a.onBind} onLogout={a.onLogout}/>
   :navigation.current==='admin'&&a.currentUser?<AdminPage key={a.currentUser.id} user={a.currentUser}/>
   :navigation.current==='archive'?<ArchivePage profile={a.page.profile}/>
   :navigation.current==='stages'?<StagesPage onStart={a.onStartStage} pending={a.pending}/>
   :navigation.current==='weapons'?<WeaponsPage profile={a.page.profile} selected={a.selected} onLevelWeapon={a.onLevelWeapon} onEquipWeapon={a.onEquipWeapon} pending={a.pending}/>
   :navigation.current==='characters'?<CharacterPage {...a} profile={a.page.profile}/>
     :navigation.current==='wishes'?<WishPage weaponResult={a.weaponResult} onWeaponWish={a.onWeaponWish} profile={a.page.profile} onWish={a.onWish} onExchangeFates={a.onExchangeFates} result={a.result} pending={a.pending}/>
     :navigation.current==='activities'?<ActivitiesPage/>
    :<HomePage {...a} profile={a.page.profile}/>}</div>
   </main>
  </div>
  {tutorialOpen&&<TutorialDialog onClose={()=>setTutorialOpen(false)}/>}
  {a.wishReveal&&<WishRevealDialog key={a.wishReveal.sequence} result={a.wishReveal} onClose={a.closeWishReveal}/>}
  {a.exitMessage&&<MessageDialog title="已退出试炼" message={a.exitMessage} onClose={a.closeExitMessage}/>}
 </div>;
}
