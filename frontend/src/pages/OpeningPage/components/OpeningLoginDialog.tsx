import {useEffect,useRef,useState} from 'react';
import {AuthPage} from '../../AuthPage';
import type {CurrentUser} from '../../../objects/CurrentUser';

export function OpeningLoginDialog({user,pending,message,error,onClose,onContinue,onRetry,onLogin,onRegister}:{user:CurrentUser|null;pending:boolean;message?:string;error:boolean;onClose:()=>void;onContinue:()=>void;onRetry:()=>void;onLogin:(username:string,password:string)=>void;onRegister:(username:string,password:string,nickname:string)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [switchAccount,setSwitchAccount]=useState(false);
 useEffect(()=>{const element=dialog.current;element?.showModal();return ()=>element?.close();},[]);
 return <dialog ref={dialog} aria-label="登录" onCancel={event=>{event.preventDefault();if(!pending)onClose();}} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-full max-w-md animate-opening-dialog overflow-y-auto border-0 bg-transparent p-4 text-stone-100 backdrop:bg-slate-950/25 motion-reduce:animate-none">
  <button disabled={pending} onClick={onClose} aria-label="关闭登录窗口" className="absolute right-7 top-6 z-10 h-8 w-8 rounded-full text-xl text-stone-300 hover:bg-white/10 disabled:opacity-30">×</button>
  {error?<section className="rounded-2xl bg-[#111d30]/95 p-8 text-center"><p className="mt-6 text-sm">{message}</p><button onClick={onRetry} className="mt-6 rounded-full bg-amber-100 px-7 py-2 text-slate-900">重新连接</button></section>
  :user&&!switchAccount?<section className="rounded-2xl border border-white/20 bg-[#111d30]/95 p-8 text-center shadow-xl"><h1 className="mt-3 font-serif text-2xl text-amber-50">登录</h1><p className="mt-6 text-lg">{user.nickname}</p><p className="mt-2 text-xs text-stone-400">{user.isGuest?'体验档案已连接':'已登录'}</p><button autoFocus onClick={onContinue} className="mt-7 w-full rounded-full bg-[#e8dbc2] px-7 py-3 text-sm text-[#243630]">进入游戏</button><button onClick={()=>setSwitchAccount(true)} className="mt-5 text-xs text-stone-400">使用其他账号登录</button></section>
  :<AuthPage pending={pending} message={message} onLogin={onLogin} onRegister={onRegister}/>}
 </dialog>;
}
