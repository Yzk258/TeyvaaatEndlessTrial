import {useState} from 'react';
import type {AdventureSettings} from '../../../objects/AdventureSettings';
import rules from '../../../../../shared/adventure-rules.json';
export function AdventureSetup({pending,onStart}:{pending:boolean;onStart:(settings:AdventureSettings)=>void}){
 const [mode,setMode]=useState<AdventureSettings['mode']>('timed');
 const [preset,setPreset]=useState<120|300|600|'custom'>(300),[custom,setCustom]=useState('900');
 const duration=preset==='custom'?Number(custom):preset;
 const valid=mode==='endless'||Number.isInteger(duration)&&duration>=60&&duration<=3600;
 return <form className="relative mt-8 max-w-xl" onSubmit={event=>{event.preventDefault();if(valid)onStart(mode==='endless'?{mode,durationSeconds:null}:{mode,durationSeconds:duration});}}>
  <fieldset disabled={pending} className="space-y-4 disabled:opacity-50"><legend className="mb-3 text-sm text-amber-50">选择冒险方式</legend>
   <div data-tutorial-target="adventure-mode" className="flex w-fit gap-3">{([{mode:'timed',label:'限时冒险'},{mode:'endless',label:'无尽模式'}] as const).map(item=><button key={item.mode} type="button" aria-pressed={mode===item.mode} onClick={()=>setMode(item.mode)} className={mode===item.mode?'rounded-xl border border-amber-100/50 bg-amber-100/10 px-6 py-3 text-sm text-amber-100':'rounded-xl border border-white/15 px-6 py-3 text-sm text-stone-400'}>{item.label}</button>)}</div>
   {mode==='timed'?<div className="space-y-3"><div className="flex flex-wrap gap-2">{([120,300,600,'custom'] as const).map(value=><button key={value} type="button" aria-pressed={preset===value} onClick={()=>setPreset(value)} className={preset===value?'rounded-full bg-amber-100 px-4 py-2 text-xs text-slate-900':'rounded-full border border-white/15 px-4 py-2 text-xs text-stone-300'}>{value==='custom'?'自定义':value/60+' 分钟'}</button>)}</div>{preset==='custom'&&<label className="flex flex-wrap items-center gap-3 text-xs text-stone-300">时长（秒）<input aria-label="自定义冒险时长（秒）" type="number" min={60} max={3600} step={1} required value={custom} onChange={event=>setCustom(event.target.value)} className="w-28 rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-amber-50"/><span>60～3600 秒</span></label>}<p className="text-xs leading-6 text-stone-300">到时结束战斗，完成额外获得 {rules.completionMora} 摩拉、{rules.completionPrimogems} 原石。</p></div>:<p className="text-xs leading-6 text-stone-300">没有时间上限，直到倒下或主动撤离，按实际进度领取奖励。</p>}
   <p className="text-xs leading-6 text-stone-400">每 {rules.stepSeconds} 秒提升敌潮难度：生命、伤害与刷怪量逐步增长。<br/>每 {rules.timeBlockSeconds} 秒 +{rules.moraPerTimeBlock} 摩拉、+{rules.primogemsPerTimeBlock} 原石；每击败 1 名敌人 +{rules.moraPerKill} 摩拉，每 {rules.killBlock} 名再 +{rules.primogemsPerKillBlock} 原石。<br/>可随时撤离并结算；暂停、升级选择与开场倒计时不计入进度。</p>
   <button data-tutorial-target="adventure-start" disabled={!valid} type="submit" className="rounded-full bg-[#e8dbc2] px-8 py-3.5 text-sm font-medium text-[#243630] disabled:opacity-40">{pending?'正在准备…':mode==='endless'?'开始无尽冒险 →':'开始限时冒险 →'}</button>
  </fieldset>
 </form>;
}
