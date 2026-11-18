import {MenuMapBackground} from './components/ui/MenuMapBackground';
import {useBattlePresentation} from './pages/hooks/useBattlePresentation';
import {useCallback,useRef,useState} from 'react';
import {WishRevealDialog} from './pages/WishPage/components/WishRevealDialog';
import {ArchivePage} from './pages/ArchivePage';
import {BagPage} from './pages/BagPage';
import {ArtifactsPage} from './pages/ArtifactsPage';
import {WeaponsPage} from './pages/WeaponsPage';
import {ConfirmDialog} from './components/ui/ConfirmDialog';
import {MessageDialog} from './components/ui/MessageDialog';
import {GraduationCap,Sparkles} from 'lucide-react';
import {MainNavigation} from './components/ui/MainNavigation';
import {OverviewPage} from './pages/OverviewPage';
import {TutorialGuide} from './components/ui/TutorialGuide';
import {CurrencyIcon} from './components/ui/CurrencyIcon';
import {useAdventure} from './pages/hooks/useAdventure';
import {HomePage} from './pages/HomePage';
import {BossHuntPage,LeyLinePage} from './pages/StagesPage';
import {BattlePage} from './pages/BattlePage';
import {usePageNavigation} from './pages/hooks/usePageNavigation';
import {CharacterPage} from './pages/CharacterPage';
import {WishPage} from './pages/WishPage';
import {OpeningPage} from './pages/OpeningPage';
import {defaultDifficultyId,type AdventureDifficultyId} from './objects/AdventureSettings';
import {leyLineCategories,type LeyLineCategoryId} from './objects/Stage';
import type {Element} from './objects/Element';
import {equipmentUsage} from './game/functions/equipmentInventory';
import {gameAsset} from './system/gameAsset';
export function App(){
 const a=useAdventure();
 const navigation=usePageNavigation();
 const presentation=useBattlePresentation(a.run?.runId??null);
 const [entered,setEntered]=useState(false);
 const [adventureDifficulty,setAdventureDifficulty]=useState<AdventureDifficultyId>(defaultDifficultyId);
 const [leyLineCategory,setLeyLineCategory]=useState<LeyLineCategoryId>(leyLineCategories[0].id);
 const [stageElement,setStageElement]=useState<Element>('pyro');
 const enter=useCallback(()=>setEntered(true),[]);
 const [tutorialOpen,setTutorialOpen]=useState(false);
 const tutorialButton=useRef<HTMLButtonElement>(null);
 const tutorialVisible=tutorialOpen&&!a.run;
 const closeTutorial=useCallback(()=>{
  setTutorialOpen(false);
  requestAnimationFrame(()=>tutorialButton.current?.focus({preventScroll:true}));
 },[]);
 if(!entered||!a.save)return <OpeningPage save={a.save} saves={a.saves} loading={a.loading} pending={a.pending} notice={a.openingNotice} error={a.saveError} onEnter={enter} onRetry={a.reloadSaves} onOpen={a.onOpen} onCreate={a.onCreate} onImport={a.onImport}/>;
 const toast=a.toast&&<div role={a.toast.kind==='error'?'alert':'status'}
  className={'pointer-events-none fixed inset-x-4 bottom-5 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] animate-page-enter rounded-xl border bg-[#182a31]/95 px-5 py-3 text-sm shadow-lg motion-reduce:animate-none sm:left-auto sm:right-6 '+(a.toast.kind==='error'?'border-rose-100/25 text-rose-100':'border-amber-100/25 text-amber-100')}>{a.toast.text}</div>;
 if(presentation.battleVisible&&a.run)return <><BattlePage key={a.run.runId} run={a.run} onSettle={a.onSettle} onAbandon={a.onAbandon} pending={a.pending}/>{toast}</>;
 const {profile,nickname,clearedStages,favoriteCharacters}=a.save;
 const exchange=a.wishExchange;
 const exchangeMessage=exchange?`还缺 ${exchange.missingFates} 个纠缠之缘，兑换需要 ${exchange.primogemCost} 原石。`:'';
 const overflow=equipmentUsage(profile).filter(({count,capacity})=>count>capacity);
 const overflowVisible=a.inventoryAlert&&overflow.length>0&&!a.pending&&!a.run&&!tutorialVisible&&
  !exchange&&!a.wishReveal&&!a.exitMessage&&!a.dismantling;
 return <div className="relative isolate animate-opening-main motion-reduce:animate-none min-h-screen font-sans text-stone-200 selection:bg-amber-100/30">
  <MenuMapBackground/>
  <div inert={presentation.transitioning||tutorialVisible} className={'transition-opacity duration-[350ms] motion-reduce:transition-none '+(presentation.transitioning?'pointer-events-none opacity-0':'opacity-100')}>
  <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col overflow-y-auto border-r border-white/8 bg-[#142129]/85 backdrop-blur-sm p-7 lg:flex">
   <div className="flex items-center gap-3 text-amber-100"><img src={gameAsset('/branding/teyvat-icon.png')} width={32} height={32} alt="" className="shrink-0"/><div><p className="font-serif text-xl tracking-[.2em]">提瓦特</p><p className="mt-1 text-[9px] tracking-[.3em] text-stone-500">ENDLESS TRIAL</p></div></div>
   <p className="mb-4 mt-12 text-[10px] tracking-[.3em] text-stone-500">冒险手册 / JOURNAL</p>
   <MainNavigation navigation={navigation}/>
   <div className="mt-auto pt-8 text-xs leading-6 text-stone-500"><Sparkles size={20} className="mb-3 text-amber-100/40"/>愿风指引你的道路。<br/>v0.1</div>
  </aside>
  <main className="mx-auto max-w-[1500px] px-5 pb-8 lg:ml-60 lg:px-12">
   <header className="mb-9 flex min-h-24 flex-wrap items-center justify-between gap-4 border-b border-white/10 py-4">
    <div data-tutorial-target="page-title"><span className="text-xs text-stone-500">{navigation.title}</span><p className="mt-1 text-sm text-stone-300">{nickname}，欢迎归来</p></div>
    <div className="flex flex-wrap items-center gap-4">
     <button ref={tutorialButton} disabled={a.pending||!!a.run} onClick={()=>setTutorialOpen(true)} aria-haspopup="dialog" className="rounded-full border border-amber-100/30 px-4 py-2 text-xs text-amber-100 transition hover:bg-amber-100/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100"><GraduationCap size={14} className="mr-2 inline"/>教程</button>
     <div className="flex gap-5 rounded-full border border-white/10 bg-white/[.02] px-5 py-2.5 text-sm"><span><CurrencyIcon kind="primogem" size={14} className="mr-2 inline"/>{profile.primogems}</span><span><CurrencyIcon kind="fate" size={14} className="mr-2 inline"/>{profile.intertwinedFates}</span><span><CurrencyIcon kind="mora" size={14} className="mr-2 inline"/>{profile.mora.toLocaleString()}</span></div>
     <div data-tutorial-target="save-tools" className="flex gap-4">
      <button disabled={a.pending||!!a.run} onClick={a.onExport} className="text-xs text-amber-100 disabled:opacity-30">导出存档</button>
      <button disabled={a.pending||!!a.run} onClick={()=>{if(a.onReturn()){setEntered(false);navigation.replacePage('overview');}}} className="text-xs text-stone-300 disabled:opacity-30">返回标题</button>
     </div>
    </div>
   </header>
   <MainNavigation navigation={navigation} compact/>
    <div key={navigation.current} className="animate-page-enter motion-reduce:animate-none">{
     navigation.current==='overview'?<OverviewPage profile={profile} nickname={nickname} selected={a.selected}/>
   :navigation.current==='archive'?<ArchivePage profile={profile} favoriteCharacters={favoriteCharacters} pending={a.pending} onFavorite={a.onFavorite}/>
   :navigation.current==='bag'?<BagPage profile={profile} pending={a.pending} onDismantleArtifact={id=>a.onDismantle('artifact',id)}/>
   :navigation.current==='artifacts'?<ArtifactsPage profile={profile} pending={a.pending} onLevelArtifact={a.onLevelArtifact}
    onDismantleArtifact={id=>a.onDismantle('artifact',id)}/>
   :navigation.current==='ley-lines'?<LeyLinePage category={leyLineCategory} onCategoryChange={setLeyLineCategory}
    onStart={a.onStartStage} pending={a.pending} clearedStages={clearedStages}/>
   :navigation.current==='boss-hunt'?<BossHuntPage element={stageElement} onElementChange={setStageElement}
    onStart={a.onStartStage} pending={a.pending} clearedStages={clearedStages}/>
   :navigation.current==='weapons'?<WeaponsPage profile={profile} onLevelWeapon={a.onLevelWeapon} pending={a.pending}
    onDismantleWeapon={id=>a.onDismantle('weapon',id)}/>
   :navigation.current==='characters'?<CharacterPage profile={profile} selected={a.selected} favoriteCharacters={favoriteCharacters} pending={a.pending}
    onSelect={a.onSelect} onFavorite={a.onFavorite} onLevel={a.onLevel} onAscend={a.onAscend} onEquipWeapon={a.onEquipWeapon} onEquipArtifact={a.onEquipArtifact}/>
     :navigation.current==='wishes'?<WishPage weaponResult={a.weaponResult} profile={profile} onWish={a.onWish} result={a.result} pending={a.pending}/>
    :<HomePage profile={profile} selected={a.selected} difficulty={adventureDifficulty} onDifficultyChange={setAdventureDifficulty} onStart={a.onStart} pending={a.pending}/>}</div>
   </main>
  </div>
  {toast}
  {tutorialVisible&&<TutorialGuide currentPage={navigation.current} goTo={navigation.replacePage} onClose={closeTutorial}/>}
  {exchange&&(profile.primogems>=exchange.primogemCost?
   <ConfirmDialog title="兑换纠缠之缘" message={exchangeMessage+'是否兑换后继续祈愿？'} confirmLabel="兑换并祈愿" pending={a.pending} onConfirm={a.confirmWishExchange} onCancel={a.cancelWishExchange}/>:
   <MessageDialog title="原石不足" message={exchangeMessage+`当前拥有 ${profile.primogems} 原石。`} onClose={a.cancelWishExchange}/>)}
  {a.wishReveal&&<WishRevealDialog key={a.wishReveal.sequence} result={a.wishReveal} onClose={a.closeWishReveal}/>}
  {a.exitMessage&&<MessageDialog title="已退出试炼" message={a.exitMessage} onClose={a.closeExitMessage}/>}
  {a.dismantling&&<ConfirmDialog title={'分解'+a.dismantling.label} confirmLabel="确认分解" pending={a.pending}
   message={`分解「${a.dismantling.name}」${a.dismantling.kind==='weapon'?' Lv.':' +'}${a.dismantling.level}，获得 ${a.dismantling.mora.toLocaleString()} 摩拉。分解后无法恢复。`}
   onConfirm={a.confirmDismantle} onCancel={a.cancelDismantle}/>}
  {overflowVisible&&<ConfirmDialog title="背包容量已超出" confirmLabel="打开背包" cancelLabel="稍后整理" pending={false}
   message={overflow.map(({label,count,capacity})=>`${label} ${count} / ${capacity}，超出 ${count-capacity} 件`).join('。')+'。本次获得的物品已入库，可分解闲置装备整理背包。'}
   onConfirm={()=>{a.dismissInventoryAlert();navigation.replacePage('bag');}} onCancel={a.dismissInventoryAlert}/>}
 </div>;
}
