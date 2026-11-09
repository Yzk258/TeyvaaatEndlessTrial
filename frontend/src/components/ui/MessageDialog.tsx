import {useEffect,useRef} from 'react';

export function MessageDialog({title,message,onClose}:{title:string;message:string;onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const element=dialog.current;
    element?.showModal();
    return ()=>element?.close();
  },[]);
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="message-dialog-title" aria-describedby="message-dialog-description" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-amber-100/20 bg-[#182a31] p-8 text-center text-stone-200 shadow-2xl backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm">
    <div aria-hidden="true" className="mb-5 text-4xl text-amber-100/70">✧</div>
    <h2 id="message-dialog-title" className="font-serif text-2xl text-amber-50">{title}</h2>
    <p id="message-dialog-description" className="mt-4 text-sm leading-7 text-stone-400">{message}</p>
    <button autoFocus onClick={onClose} className="mt-7 rounded-full bg-[#e8dbc2] px-10 py-3 text-sm font-medium text-[#243630] transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">知道了</button>
  </dialog>;
}
