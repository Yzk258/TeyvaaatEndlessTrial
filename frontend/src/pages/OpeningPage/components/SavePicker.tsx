import {useEffect,useRef,useState} from 'react';
import type {LocalSave} from '../../../game/local/LocalSave';

type Props={
 saves:readonly LocalSave[];pending:boolean;error:string;notice:string;
 onClose:()=>void;onOpen:(id:string)=>void;onCreate:(nickname:string)=>void;
 onImport:(file:File)=>void;onRetry:()=>void;
};

export function SavePicker({saves,pending,error,notice,onClose,onOpen,onCreate,onImport,onRetry}:Props){
 const dialog=useRef<HTMLDialogElement>(null);
 const [nickname,setNickname]=useState('');
 useEffect(()=>{
  const element=dialog.current;
  element?.showModal();
  return ()=>element?.close();
 },[]);
 return <dialog ref={dialog} aria-label="本地存档" onCancel={event=>{event.preventDefault();if(!pending)onClose();}}
  className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md animate-opening-dialog overflow-y-auto rounded-2xl border border-amber-100/20 bg-[#111d30]/95 p-7 text-stone-100 shadow-xl backdrop:bg-slate-950/35 motion-reduce:animate-none">
  <button type="button" disabled={pending} onClick={onClose} aria-label="关闭存档窗口" className="absolute right-4 top-4 h-8 w-8 rounded-full text-xl hover:bg-white/10 disabled:opacity-30">×</button>
  <p className="text-xs tracking-[.25em] text-amber-100/60">ENDLESS TRIAL</p>
  <h1 className="mt-3 font-serif text-2xl text-amber-50">本地存档</h1>
  <p className="mt-2 text-sm text-stone-400">进度自动保存在此浏览器。</p>
  {error&&<div role="alert" className="mt-4 text-sm text-rose-200">{error}<button type="button" onClick={onRetry} className="ml-3 underline">重试</button></div>}
  {saves.length>0&&<ul className="my-5 space-y-2" aria-label="继续游戏">{saves.map(save=>
   <li key={save.id}><button type="button" disabled={pending} onClick={()=>onOpen(save.id)}
    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-left hover:bg-white/10 disabled:opacity-50">
    <span className="min-w-0"><strong className="block truncate text-amber-50">{save.nickname}</strong>
     <span className="text-xs text-stone-400">{save.profile.runs} 次试炼 · {new Date(save.updatedAt).toLocaleString('zh-CN')}</span></span>
    <span className="shrink-0 text-xs text-amber-100">继续游戏 →</span>
   </button></li>)}</ul>}
  <form className="mt-5 flex flex-wrap items-end gap-3" onSubmit={event=>{
   event.preventDefault();
   onCreate(nickname.trim()||'旅行者');
  }}>
   <label className="min-w-36 flex-1 text-xs text-stone-400">存档名称
    <input value={nickname} onChange={event=>setNickname(event.target.value)} maxLength={30} placeholder="旅行者"
     className="mt-1 block w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-stone-100"/>
   </label>
   <button disabled={pending||!!error} className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-slate-900 disabled:opacity-50">新游戏</button>
  </form>
  <label className="mt-5 block text-xs text-stone-400">导入存档
   <input type="file" accept=".json,application/json" disabled={pending||!!error} className="mt-1 block w-full text-sm text-stone-300 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-stone-200"
    onChange={event=>{const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(file)onImport(file);}}/>
  </label>
  {notice&&<p role="alert" className="mt-4 text-sm text-rose-200">{notice}</p>}
 </dialog>;
}
