import {useEffect,useId,useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {PageId} from '../../pages/hooks/usePageNavigation';

type GuideStep={readonly page:PageId;readonly target:string;readonly title:string;readonly description:string};
const guide:readonly GuideStep[]=[
 {page:'overview',target:'active-character',title:'当前出战',description:'这里可以查看下次出战的角色、等级和装备。旁边汇总试炼次数和收集进度。'},
 {page:'camp',target:'adventure-mode',title:'选择无尽难度',description:'从 20 到 100 级选择怪物生命倍率。敌潮会逐波增强，可以随时撤离并按进度结算。'},
 {page:'camp',target:'adventure-start',title:'进入战斗',description:'从这里开始冒险。WASD 或方向键移动，角色会自动攻击。击败敌人获得经验，升级时三选一。按 Esc 可暂停。'},
 {page:'stages',target:'stage-intro',title:'关卡挑战',description:'选择难度、奖励类别和地图。角色在本局使用固定属性，击败全部敌人即可领取奖励。'},
 {page:'characters',target:'character-enhancement',title:'角色培养',description:'从下方选择出战角色。「强化」可对比升级数值，「武器」可为当前角色装备或卸下武器。'},
 {page:'weapons',target:'weapon-intro',title:'武器培养',description:'选择一件已获得的武器，查看天赋并强化主副词条。'},
 {page:'artifacts',target:'artifact-training',title:'圣遗物培养',description:'选择圣遗物并消耗摩拉提升主词条。前往角色培养的「圣遗物」栏装备，集齐两件或四件同套圣遗物可激活套装效果。'},
 {page:'archive',target:'archive-tabs',title:'图鉴',description:'切换角色、武器、怪物或圣遗物图鉴，查看属性和收集进度。'},
 {page:'wishes',target:'wish-pools',title:'祈愿',description:'用纠缠之缘在角色或武器卡池祈愿。两个卡池各自记录四星和五星保底。'},
 {page:'overview',target:'save-tools',title:'本地存档',description:'进度自动保存。可以导出备份，也可以返回标题切换存档或导入备份。'}
];

type FocusRect={readonly left:number;readonly top:number;readonly width:number;readonly height:number};
type GuideLayout={readonly focus:FocusRect|null;readonly left:number;readonly top:number};
const gap=12;
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(value,max));

function guideLayout(anchor:DOMRect|undefined,card:DOMRect,width:number,height:number):GuideLayout{
 const leftLimit=width-card.width-gap,topLimit=height-card.height-gap;
 const focus=anchor&&anchor.width>0&&anchor.height>0&&anchor.right>0&&anchor.left<width&&anchor.bottom>0&&anchor.top<height?{
  left:Math.max(4,anchor.left-7),top:Math.max(4,anchor.top-7),
  width:Math.min(width-4,anchor.right+7)-Math.max(4,anchor.left-7),
  height:Math.min(height-4,anchor.bottom+7)-Math.max(4,anchor.top-7)
 }:null;
 if(!focus||focus.width<=0||focus.height<=0)return {focus:null,left:clamp((width-card.width)/2,gap,leftLimit),top:clamp((height-card.height)/2,gap,topLimit)};
 const right=focus.left+focus.width,bottom=focus.top+focus.height;
 const sideTop=clamp(focus.top+(focus.height-card.height)/2,gap,topLimit);
 if(right+gap<=leftLimit)return {focus,left:right+gap,top:sideTop};
 if(focus.left-card.width-gap>=gap)return {focus,left:focus.left-card.width-gap,top:sideTop};
 const left=clamp(focus.left+(focus.width-card.width)/2,gap,leftLimit);
 if(bottom+gap<=topLimit)return {focus,left,top:bottom+gap};
 if(focus.top-card.height-gap>=gap)return {focus,left,top:focus.top-card.height-gap};
 return {focus,left,top:focus.top+focus.height/2<height/2?Math.max(gap,topLimit):gap};
}

export function TutorialGuide({currentPage,goTo,onClose}:{currentPage:PageId;goTo:(page:PageId)=>void;onClose:()=>void}){
 const [origin]=useState(()=>({page:currentPage,x:window.scrollX,y:window.scrollY}));
 const [index,setIndex]=useState(0);
 const step=guide[Math.min(index,guide.length-1)];
 const [layout,setLayout]=useState<GuideLayout|null>(null);
 const panel=useRef<HTMLDivElement>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const titleId=useId(),descriptionId=useId();
 const ready=layout!==null;

 useLayoutEffect(()=>{goTo(step.page);},[goTo,step.page]);
 useEffect(()=>{
  window.addEventListener('hashchange',onClose);
  return ()=>window.removeEventListener('hashchange',onClose);
 },[onClose]);
 useLayoutEffect(()=>{
  if(currentPage!==step.page){setLayout(null);return;}
  const target=document.querySelector<HTMLElement>('[data-tutorial-target="'+step.target+'"]')??
   document.querySelector<HTMLElement>('[data-tutorial-target="page-title"]');
  target?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
  let frame=0;
  const measure=()=>{
   if(!panel.current)return;
   setLayout(guideLayout(target?.getBoundingClientRect(),panel.current.getBoundingClientRect(),document.documentElement.clientWidth,window.innerHeight));
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  measure();
  const observer=new ResizeObserver(schedule);
  if(target)observer.observe(target);
  if(panel.current)observer.observe(panel.current);
  window.addEventListener('resize',schedule);
  document.addEventListener('scroll',schedule,true);
  document.addEventListener('animationend',schedule,true);
  return ()=>{
   observer.disconnect();cancelAnimationFrame(frame);
   window.removeEventListener('resize',schedule);
   document.removeEventListener('scroll',schedule,true);
   document.removeEventListener('animationend',schedule,true);
  };
 },[currentPage,step]);
 useEffect(()=>{if(ready)heading.current?.focus({preventScroll:true});},[ready,step]);

 const finish=()=>{
  goTo(origin.page);onClose();
  requestAnimationFrame(()=>window.scrollTo({left:origin.x,top:origin.y,behavior:'instant'}));
 };
 const last=index>=guide.length-1;
 return createPortal(<div className="fixed inset-0 z-50 overflow-hidden" onKeyDown={event=>{
  if(event.key==='Escape'){event.preventDefault();finish();return;}
  if(event.key!=='Tab'||!panel.current)return;
  const buttons=panel.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
  const first=buttons[0],last=buttons[buttons.length-1];
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===heading.current)){
   event.preventDefault();last?.focus();
  }else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }}>
  {layout?.focus?<div aria-hidden="true" data-tutorial-spotlight className="pointer-events-none absolute rounded-2xl border-2 border-amber-200 shadow-[0_0_0_200vmax_rgba(4,12,18,0.78)]" style={layout.focus}/>
   :<div aria-hidden="true" className="absolute inset-0 bg-slate-950/75"/>}
  <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}
   className="absolute z-10 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[21rem] overflow-y-auto rounded-2xl border border-amber-100/30 bg-[#182a31] p-5 text-stone-200 shadow-2xl"
   style={layout?{left:layout.left,top:layout.top}:{visibility:'hidden'}}>
   <div key={index} className="animate-opening-dialog motion-reduce:animate-none">
    <p className="text-xs tracking-widest text-amber-100/70">冒险手册 · {index+1} / {guide.length}</p>
    <h2 ref={heading} tabIndex={-1} id={titleId} className="mt-2 font-serif text-2xl text-amber-50 outline-none">{step.title}</h2>
    <p id={descriptionId} className="mt-3 text-sm leading-6 text-stone-300">{step.description}</p>
   </div>
   <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
    <button type="button" onClick={finish} className="mr-auto rounded-lg px-2 py-2 text-stone-300 hover:bg-white/5">跳过</button>
    <button type="button" disabled={index===0} onClick={()=>setIndex(value=>Math.max(0,value-1))}
     className="rounded-full border border-white/15 px-3 py-2 disabled:opacity-40">上一步</button>
    <button type="button" onClick={last?finish:()=>setIndex(value=>Math.min(guide.length-1,value+1))}
     className="rounded-full bg-amber-100 px-4 py-2 text-slate-900">{last?'完成':'下一步'}</button>
   </div>
  </div>
 </div>,document.body);
}
