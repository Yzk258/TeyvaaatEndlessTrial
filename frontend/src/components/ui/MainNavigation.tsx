import {useId,useRef,useState} from 'react';
import {Backpack,BookOpen,CalendarCheck,ChevronDown,Compass,Flag,Gem,LayoutDashboard,Sparkles,Swords,Tent,TrendingUp,Users} from 'lucide-react';
import type {NavigationGroup,PageId,usePageNavigation} from '../../pages/hooks/usePageNavigation';

const icons:Readonly<Record<PageId|NavigationGroup['id'],typeof Compass>>={
 overview:LayoutDashboard,adventure:Compass,camp:Tent,stages:Flag,characters:Users,weapons:Swords,
 training:TrendingUp,bag:Backpack,artifacts:Gem,archive:BookOpen,wishes:Sparkles,activities:CalendarCheck
};

function itemClass(active:boolean,compact:boolean){
 if(compact)return 'rounded-full px-4 py-2 text-sm '+(active?'bg-amber-100 text-slate-900':'border border-white/15');
 return 'rounded-xl px-4 py-3 text-sm '+(active?'border border-amber-100/15 bg-amber-100/5 text-amber-100':'text-stone-400 hover:bg-white/5');
}

function GroupMenu({group,current,active,compact}:{group:NavigationGroup;current:PageId;active:boolean;compact:boolean}){
 const [open,setOpen]=useState(!compact&&active);
 const trigger=useRef<HTMLButtonElement>(null);
 const panelId=useId();
 const Icon=icons[group.id];
 return <div className={compact?'relative':undefined} onKeyDown={event=>{
  if(event.key==='Escape'&&open){setOpen(false);trigger.current?.focus();}
 }}>
  <button ref={trigger} type="button" aria-expanded={open} aria-controls={panelId}
   className={itemClass(active,compact)+' flex items-center gap-2 '+(compact?'':'w-full text-left')}
   onClick={()=>setOpen(value=>!value)}>
   {!compact&&<Icon size={16} aria-hidden="true"/>}
   <span className="flex-1">{group.label}</span>
   <ChevronDown size={15} aria-hidden="true" className={open?'rotate-180':undefined}/>
  </button>
  <div id={panelId} hidden={!open} className={compact?'absolute left-0 top-full z-20 mt-2 min-w-36 space-y-1 rounded-xl border border-amber-100/20 bg-[#142129] p-2 shadow-xl':'ml-5 mt-1 space-y-1 border-l border-amber-100/15 pl-2'}>
   {group.children.map(page=>{
    const ItemIcon=icons[page.id];
    const selected=current===page.id;
    return <a key={page.id} href={page.href} aria-current={selected?'page':undefined} onClick={()=>{if(compact)setOpen(false);}}
     className={'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm '+(selected?'bg-amber-100/10 text-amber-100':'text-stone-300 hover:bg-white/5')}>
     <ItemIcon size={15} aria-hidden="true"/>{page.label}
    </a>;
   })}
  </div>
 </div>;
}

export function MainNavigation({navigation,compact=false}:{navigation:ReturnType<typeof usePageNavigation>;compact?:boolean}){
 return <nav className={compact?'mb-6 flex flex-wrap gap-2 lg:hidden':'space-y-2'} aria-label="主导航">
  {navigation.entries.map(entry=>{
   if('children' in entry){
    const active=entry.children.some(page=>page.id===navigation.current);
    return <GroupMenu key={entry.id+':'+active} group={entry} current={navigation.current} active={active} compact={compact}/>;
   }
   const Icon=icons[entry.id],active=navigation.current===entry.id;
   return <a key={entry.id} href={entry.href} aria-current={active?'page':undefined} className={itemClass(active,compact)+(compact?'':' block')}>
    {!compact&&<Icon size={16} className="mr-3 inline" aria-hidden="true"/>}{entry.label}
   </a>;
  })}
 </nav>;
}
