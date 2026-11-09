import {useEffect,useRef} from 'react';
export function ConfirmDialog({title,message,pending,onConfirm,onCancel}:{title:string;message:string;pending:boolean;onConfirm:()=>void;onCancel:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const element=dialog.current;element?.showModal();return ()=>element?.close();},[]);
 return <dialog ref={dialog} onCancel={event=>{event.preventDefault();if(!pending)onCancel();}} aria-labelledby="confirm-title" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-amber-100/20 bg-[#182a31] p-8 text-center text-stone-200 shadow-2xl backdrop:bg-slate-950/75"><h2 id="confirm-title" className="font-serif text-2xl text-amber-50">{title}</h2><p className="my-6 text-sm leading-7 text-stone-400">{message}</p><div className="flex justify-center gap-4"><button autoFocus disabled={pending} onClick={onCancel} className="rounded-full border border-white/15 px-6 py-2">取消</button><button disabled={pending} onClick={onConfirm} className="rounded-full bg-rose-200 px-6 py-2 text-slate-900 disabled:opacity-40">{pending?'处理中…':'确认退出'}</button></div></dialog>;
}
