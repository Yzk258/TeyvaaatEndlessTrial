import {useEffect,useState} from 'react';
import {SavePicker} from './components/SavePicker';
import {OfflinePreparation} from './components/OfflinePreparation';
import type {LocalSave} from '../../game/local/LocalSave';
import {gameAsset} from '../../system/gameAsset';
type Screen='gate'|'approaching'|'saves'|'entering';
export function OpeningPage({save,saves,loading,pending,notice,error,onEnter,onRetry,onOpen,onCreate,onImport}:{
 save:LocalSave|null;saves:readonly LocalSave[];loading:boolean;pending:boolean;notice:string;error:string;
 onEnter:()=>void;onRetry:()=>void;onOpen:(id:string)=>void;onCreate:(nickname:string)=>void;onImport:(file:File)=>void;
}){
 const [screen,setScreen]=useState<Screen>('gate');
 useEffect(()=>{if(screen==='saves'&&save)setScreen('entering');},[screen,save]);
 useEffect(()=>{
  if(screen!=='approaching'&&screen!=='entering')return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=window.setTimeout(()=>{if(screen==='approaching')setScreen('saves');else onEnter();},reduced?0:screen==='approaching'?850:350);
  return ()=>window.clearTimeout(timer);
 },[screen,onEnter]);
 return <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#111e25] px-5 py-16">
  <div aria-hidden="true" className={'pointer-events-none absolute inset-0 -z-10 select-none transition-[transform,filter,opacity] ease-in-out motion-reduce:transition-none '+(screen==='gate'?'duration-[850ms] scale-100 brightness-100 opacity-100':screen==='entering'?'duration-[350ms] scale-[1.12] brightness-75 opacity-0':'duration-[850ms] scale-[1.08] brightness-75 opacity-100')}>
   <img src={gameAsset('/backgrounds/sky-gate-pixel-v2.png')} alt="" draggable={false}
    className="absolute inset-0 h-full w-full object-cover object-center [image-rendering:pixelated]"/>
   <img src={gameAsset('/backgrounds/sky-gate-clouds-a.png')} alt="" draggable={false} decoding="async" className="gate-cloud-frame"/>
   <img src={gameAsset('/backgrounds/sky-gate-clouds-b.png')} alt="" draggable={false} decoding="async" className="gate-cloud-frame gate-cloud-frame-next"/>
   <div className="gate-sunlight"/>
  </div>
  {screen==='gate'&&<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
   <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0b1620]/75 to-transparent"/>
   <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#0b1620]/85 to-transparent"/>
   {Array.from({length:16},(_,i)=><span key={i} className="absolute bottom-0 animate-gate-mote rounded-full bg-amber-50/70 opacity-0 blur-[1px] motion-reduce:animate-none" style={{left:((i*61+7)%100)+'%',width:(i%3)+3,height:(i%3)+3,animationDelay:(i*0.62).toFixed(2)+'s',animationDuration:(7+(i%5)).toFixed(1)+'s'}}/>)}
  </div>}
  {screen==='gate'&&<div className="pointer-events-none absolute inset-x-0 top-[12%] flex flex-col items-center text-center">
   <p className="animate-gate-rise text-[11px] tracking-[.65em] text-amber-50/70 motion-reduce:animate-none">TEYVAT · ENDLESS TRIAL</p>
   <h1 className="animate-gate-rise mt-5 font-serif text-6xl tracking-[.14em] text-[#f4ecdc] drop-shadow-[0_2px_18px_rgba(0,0,0,.55)] motion-reduce:animate-none" style={{animationDelay:'.12s'}}>提瓦特</h1>
   <p className="animate-gate-rise mt-4 text-sm tracking-[.5em] text-amber-100/70 motion-reduce:animate-none" style={{animationDelay:'.24s'}}>无尽试炼</p>
   <span className="animate-gate-rise mt-7 h-px w-28 bg-gradient-to-r from-transparent via-amber-100/50 to-transparent motion-reduce:animate-none" style={{animationDelay:'.36s'}}/>
  </div>}
  {screen==='gate'&&<div className="absolute inset-x-0 bottom-14 flex justify-center">
   <button disabled={loading} onClick={()=>setScreen('approaching')} className="group relative overflow-hidden rounded-full border border-amber-100/30 bg-slate-900/40 px-11 py-3 text-sm tracking-[.35em] text-amber-50 backdrop-blur-sm transition hover:border-amber-100/60 hover:bg-slate-900/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100 disabled:cursor-wait disabled:opacity-60">
    <span className="relative z-10">{loading?'正在读取存档…':'点击进入'}</span>
    <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-100/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"/>
   </button>
  </div>}
  {screen==='gate'&&<p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[10px] tracking-[.3em] text-stone-400/70">穿过门扉，开启冒险</p>}
  {screen==='gate'&&<OfflinePreparation/>}
  {screen==='approaching'&&<div role="status" aria-live="polite" className="absolute inset-x-0 bottom-14 animate-gate-rise text-center text-sm tracking-[.4em] text-amber-100/80 motion-reduce:animate-none">正在进入…</div>}
  {screen==='saves'&&<SavePicker saves={saves} pending={pending||loading} notice={notice} error={error} onClose={()=>setScreen('gate')} onRetry={onRetry} onOpen={onOpen} onCreate={onCreate} onImport={onImport}/>}
 </main>;
}
