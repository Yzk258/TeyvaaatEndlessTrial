import {useEffect,useId,useRef} from 'react';
export function ConfirmDialog({title,message,confirmLabel,pending,onConfirm,onCancel}:{title:string;message:string;confirmLabel:string;pending:boolean;onConfirm:()=>void;onCancel:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const titleId=useId(),descriptionId=useId();
 useEffect(()=>{const element=dialog.current;element?.showModal();return ()=>element?.close();},[]);
 return <dialog ref={dialog} onCancel={event=>{event.preventDefault();if(!pending)onCancel();}} aria-labelledby={titleId} aria-describedby={descriptionId} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-amber-100/20 bg-[#182a31] p-8 text-center text-stone-200 shadow-2xl backdrop:bg-slate-950/75">
  <h2 id={titleId} className="font-serif text-2xl text-amber-50">{title}</h2>
  <p id={descriptionId} className="my-6 text-sm leading-7 text-stone-400">{message}</p>
  <div className="flex justify-center gap-4">
   <button type="button" autoFocus disabled={pending} onClick={onCancel} className="rounded-full border border-white/15 px-6 py-2">取消</button>
   <button type="button" disabled={pending} onClick={onConfirm} className="rounded-full bg-amber-100 px-6 py-2 text-slate-900 enabled:hover:bg-amber-50 disabled:opacity-40">{pending?'处理中…':confirmLabel}</button>
  </div>
 </dialog>;
}
