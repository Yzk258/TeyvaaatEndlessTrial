import {useState} from 'react';
import type {RunStart} from '../../objects/Profile';
import {rewardCurrencyLabels} from '../../objects/TrialReward';
import {useBattle} from '../../game/hooks/useBattle';
import {AdventureResult} from './components/AdventureResult';
import {ExitBattleDialog} from './components/ExitBattleDialog';
import {UpgradeOptions} from './components/UpgradeOptions';
import {BattleScene} from './components/BattleScene';
import {useReducedBattleMotion} from './hooks/useReducedBattleMotion';
import {BattleHUD} from './components/BattleHUD';

export function BattlePage({run,onSettle,onAbandon,pending}:{run:RunStart;onSettle:(kills:number,ticks:number,withdrawing:boolean,artifactDrops:readonly string[])=>void;onAbandon:()=>void;pending:boolean}){
 const {stage,adventure,character,map}=run;
 const [confirmExit,setConfirmExit]=useState(false);
 const {state:s,dispatch,pause,resume}=useBattle(run);
 const reducedMotion=useReducedBattleMotion();
 const title=run.stage===null?`${map.title} · 无尽 · ${run.adventure.difficulty.level} 级`:`${map.title} · ${run.stageDifficulty.level} 级`;
 const cleared=stage!==null&&s.kills===stage.enemies;
 const stageRewardText=stage?.rewards.map(reward=>`${rewardCurrencyLabels[reward.currency]} +${reward.amount}`).join(' · ');
 return <section className="fixed inset-0 z-40 h-dvh w-screen overflow-hidden bg-[#263d30] text-stone-200">
 <BattleScene state={s} character={character} bounded={map.layout==='arena'} reducedMotion={reducedMotion}/>
 <BattleHUD state={s} title={title} stageRewardText={stageRewardText} pending={pending} confirmExit={confirmExit} onPause={s.phase==='paused'?resume:pause} onExit={()=>{pause();setConfirmExit(true);}}/>
 <div className="absolute inset-0 z-20 pointer-events-none [&>div]:pointer-events-auto">
  {s.phase==='collecting'&&<div role="status" className="absolute inset-x-0 bottom-12 text-center text-sm text-amber-100">正在吸收掉落…</div>}
  {s.phase==='countdown'&&!confirmExit&&<div role="status" aria-live="polite" className="absolute inset-0 grid place-content-center gap-5 bg-slate-950/75 text-center">
   <p className="text-sm tracking-[.3em] text-amber-100/70">准备迎战</p><p className="font-serif text-8xl text-amber-100">{Math.ceil(s.countdownTicks/20)}</p><p className="text-sm text-stone-400">WASD / 方向键移动 · 战斗即将开始</p>
  </div>}
  {s.phase==='paused'&&!confirmExit&&<div role="dialog" aria-modal="true" aria-label="战斗已暂停" className="absolute inset-0 grid place-content-center gap-5 bg-slate-950/90 text-center">
   <h2 className="font-serif text-4xl text-amber-100">战斗已暂停</h2><p className="text-sm text-stone-400">时间、敌人和技能均已冻结</p><button onClick={resume} className="rounded-full bg-amber-100 px-8 py-3 text-slate-900">继续战斗</button><button onClick={()=>setConfirmExit(true)} className="text-sm text-rose-100">退出试炼</button>
  </div>}
  {adventure&&s.phase==='upgrade'&&<UpgradeOptions state={s} onChoose={choice=>dispatch({kind:'upgrade',choice})}/>}
  {s.phase==='ended'&&<div className="absolute inset-0 grid place-content-center gap-5 bg-slate-950/90 text-center">
   <h2 className="font-serif text-4xl text-amber-100">{stage?(cleared?'关卡通关':'挑战失败'):'旅途暂歇'}</h2>
   <p>击败 {s.kills} 名敌人 · 坚持 {Math.floor(s.combatTicks/20)} 秒</p>
   {cleared&&<p className="text-amber-100">{stageRewardText}</p>}
   {adventure&&<AdventureResult state={s}/>}
   <button disabled={pending} className="rounded-full bg-amber-100 px-8 py-3 text-slate-900 disabled:opacity-40" onClick={()=>onSettle(s.kills,s.combatTicks,false,s.artifactDrops)}>{pending?'正在结算…':stage&&!cleared?'结束挑战并返回':'领取奖励并返回'}</button>
  </div>}
  {confirmExit&&<ExitBattleDialog state={s} stage={!!stage} pending={pending} onConfirm={()=>stage?onAbandon():onSettle(s.kills,s.combatTicks,true,s.artifactDrops)} onCancel={()=>{setConfirmExit(false);resume();}}/>}
 </div>
 </section>;
}
