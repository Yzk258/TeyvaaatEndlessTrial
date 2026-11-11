import {useId,useState,type ReactNode} from 'react';

type DevelopmentTab={readonly id:string;readonly label:string;readonly content?:ReactNode;readonly inDevelopment?:boolean};

export function DevelopmentTabs({label,tabs,tutorialTarget}:{label:string;tabs:readonly DevelopmentTab[];tutorialTarget?:string}){
 const [active,setActive]=useState(0);
 const id=useId();

 return <section data-tutorial-target={tutorialTarget} className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#142a31]/80">
  <div role="tablist" aria-label={label} className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-4 sm:px-6" onKeyDown={event=>{
   const last=tabs.length-1;
   let next=active;
   switch(event.key){
    case 'ArrowRight':next=(active+1)%tabs.length;break;
    case 'ArrowLeft':next=(active+last)%tabs.length;break;
    case 'Home':next=0;break;
    case 'End':next=last;break;
    default:return;
   }
   event.preventDefault();
   setActive(next);
   event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }}>
   {tabs.map(({id:section,label,inDevelopment},index)=><button key={section} type="button" role="tab" id={id+'-tab-'+section}
    aria-selected={index===active} aria-controls={id+'-panel-'+section} tabIndex={index===active?0:-1} onClick={()=>setActive(index)}
    className="rounded-full border border-white/10 px-3 py-2 text-sm text-stone-300 transition hover:border-amber-100/35 aria-selected:border-amber-100 aria-selected:bg-amber-100 aria-selected:text-slate-900 sm:px-4">
    {label}{inDevelopment&&<span className="ml-1 text-xs opacity-80">（建设中）</span>}
   </button>)}
  </div>
  {tabs.map(({id:section,content},index)=><div key={section} role="tabpanel" id={id+'-panel-'+section} aria-labelledby={id+'-tab-'+section}
   tabIndex={0} hidden={index!==active} className={index===active?'flex min-h-56 flex-1 flex-col p-5 sm:p-8':'hidden'}>
   {index===active&&content}
  </div>)}
 </section>;
}
