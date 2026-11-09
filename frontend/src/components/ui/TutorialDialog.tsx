import {useEffect,useRef} from 'react';
import type {ComponentType} from 'react';
import {BookOpen,CalendarCheck,Flag,GraduationCap,LayoutDashboard,Shield,Sparkles,Swords,Tent,UserRound,Users} from 'lucide-react';
const GUIDES:readonly {readonly Icon:ComponentType<{size?:number}>;readonly label:string;readonly desc:string}[]=[
 {Icon:LayoutDashboard,label:'综合',desc:'一屏查看资产、出战角色、冒险次数与角色/武器收集进度。'},
 {Icon:Tent,label:'冒险营地',desc:'查看当前出战角色，选择无尽或限时冒险，进入战斗。'},
 {Icon:Flag,label:'关卡挑战',desc:'挑战敌人总量固定的关卡，清场通关后领取摩拉与原石奖励。'},
 {Icon:Users,label:'角色培养',desc:'选择出战角色，消耗摩拉提升等级与生命，并为其装备武器。'},
 {Icon:Swords,label:'武器培养',desc:'强化武器主副词条，把武器装备给武器类型匹配的角色。'},
 {Icon:BookOpen,label:'图鉴',desc:'浏览全部角色与武器，查看基础属性、成长与天赋，已解锁状态一目了然。'},
 {Icon:Sparkles,label:'祈愿',desc:'消耗纠缠之缘抽取角色与武器，含四星/五星保底与揭晓动画。'},
 {Icon:CalendarCheck,label:'活动',desc:'每日签到与未来活动预告。'},
 {Icon:UserRound,label:'我的账号',desc:'查看身份、把体验档案绑定到正式账号，或退出登录。'},
 {Icon:Shield,label:'管理员中心',desc:'仅管理员可见，查看账号并调整其他用户身份。'},
];
export function TutorialDialog({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const element=dialog.current;element?.showModal();return ()=>element?.close();},[]);
 return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="tutorial-title" className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-amber-100/20 bg-[#182a31] p-8 text-stone-200 shadow-2xl backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm">
  <div className="flex items-center gap-3 text-amber-100"><GraduationCap size={26}/><h2 id="tutorial-title" className="font-serif text-2xl text-amber-50">冒险手册 · 教程</h2></div>
  <p className="mt-3 text-sm leading-6 text-stone-400">每个页面做什么，一目了然。点击左侧导航即可前往对应页面。</p>
  <ul className="mt-6 grid gap-3 sm:grid-cols-2">{GUIDES.map(({Icon,label,desc})=><li key={label} className="rounded-2xl border border-white/10 bg-white/[.02] p-4"><div className="flex items-center gap-3 text-amber-100"><Icon size={18}/><strong className="text-sm font-medium">{label}</strong></div><p className="mt-2 text-xs leading-6 text-stone-400">{desc}</p></li>)}</ul>
  <div className="mt-5 rounded-2xl border border-emerald-100/15 bg-emerald-100/[.03] p-4"><h3 className="text-sm text-emerald-100">战斗操作</h3><p className="mt-2 text-xs leading-6 text-stone-400">WASD / 方向键移动，角色自动攻击；击败敌人积累经验，升级时三选一强化。Esc 或顶部按钮暂停，退出需确认。</p></div>
  <div className="mt-7 text-center"><button autoFocus onClick={onClose} className="rounded-full bg-[#e8dbc2] px-10 py-3 text-sm font-medium text-[#243630] transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">开始冒险</button></div>
 </dialog>;
}
