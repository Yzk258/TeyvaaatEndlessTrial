import {adventureDifficulty,adventureReward,eliteWaveInterval} from '../../../game/functions/adventureProgress';
import type {BattleState} from '../../../game/objects/BattleState';
import {experienceRequired} from '../../../game/functions/stepBattle';

const controlClass='min-h-7 rounded px-1.5 text-xs text-amber-50 hover:bg-white/15 focus-visible:outline focus-visible:outline-amber-200 disabled:opacity-40';

function BattleMeter({label,shortLabel,value,max,color}:{label:string;shortLabel:string;value:number;max:number;color:'health'|'experience'}){
 return <div className="flex min-w-0 items-center gap-1.5">
  <span className={color==='health'?'shrink-0 text-emerald-100':'shrink-0 text-sky-100'}>{shortLabel}</span>
  <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
   className="h-1 min-w-4 flex-1 overflow-hidden rounded-full bg-black/35">
   <div className={'h-full rounded-full '+(color==='health'?'bg-emerald-300':'bg-sky-300')} style={{width:(100*value/max)+'%'}}/>
  </div>
  <span className="shrink-0 tabular-nums text-stone-200">{value} / {max}</span>
 </div>;
}

export function BattleHUD({state:s,title,stageRewardText,pending,confirmExit,onPause,onExit}:{state:BattleState;title:string;stageRewardText?:string;pending:boolean;confirmExit:boolean;onPause:()=>void;onExit:()=>void}){
 const endless=s.targetEnemies===null;
 const difficulty=s.adventure?adventureDifficulty(s.adventure,s.combatTicks):null;
 const reward=s.adventure?adventureReward(s.adventure,s.kills,s.combatTicks):null;
 const eliteActive=endless&&s.enemies.some(enemy=>enemy.kind==='elite');
 return <header aria-label="战斗状态" className="pointer-events-none absolute inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 mx-auto max-w-2xl rounded-lg border border-white/15 bg-[#101e25]/55 px-2 py-1 text-xs leading-4 text-stone-100 shadow-sm sm:px-3">
  {s.phase==='collecting'&&<p role="status" className="absolute inset-x-0 bottom-full mb-2 text-center text-sm text-amber-100">正在吸收掉落…</p>}
  <div className="flex items-center gap-2">
   <h2 title={title} className="hidden min-w-0 flex-1 truncate font-medium text-amber-50 sm:block">{title}</h2>
   <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 tabular-nums sm:flex-none">
    <span className="whitespace-nowrap">{Math.floor(s.combatTicks/20)} 秒</span>
    <span className="whitespace-nowrap">击败 {s.kills}{!endless?' / '+s.targetEnemies:''}</span>
    {difficulty&&<span className="whitespace-nowrap text-amber-100">第 {difficulty.wave} 波</span>}
    {eliteActive&&<span className="whitespace-nowrap text-rose-200">精英在场</span>}
   </div>
   <div className="pointer-events-auto flex shrink-0 items-center">
    <details className="group">
     <summary aria-label="战斗详情" className={controlClass+' flex cursor-pointer list-none items-center group-open:bg-white/15 [&::-webkit-details-marker]:hidden'}>详情</summary>
     <div className="absolute right-0 bottom-full mb-2 max-h-[45dvh] w-64 max-w-full overflow-y-auto rounded-lg border border-white/15 bg-[#101e25]/85 p-3 shadow-lg">
      <p className="mb-2 font-medium text-amber-50 sm:hidden">{title}</p>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5">
       <div><dt>攻击</dt><dd className="text-amber-50">{s.power}</dd></div>
       <div><dt>射程</dt><dd className="text-amber-50">{s.attackRange}</dd></div>
       <div><dt>攻速</dt><dd className="text-amber-50">{(20/s.attackIntervalTicks).toFixed(1)} 次/秒</dd></div>
       <div><dt>移速</dt><dd className="text-amber-50">{s.moveSpeed}</dd></div>
       <div><dt>每轮攻击</dt><dd className="text-amber-50">{s.extraAttacks+1} 次</dd></div>
       {s.stageMora!==0&&<div><dt>{endless?'掉落摩拉':'已收集摩拉'}</dt><dd className="text-amber-50">{s.collectedMora}{s.stageMora!==null?' / '+s.stageMora:''}</dd></div>}
      </dl>
      <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
       {stageRewardText&&<p className="text-amber-100">通关奖励 {stageRewardText}</p>}
       {s.stageDifficulty&&<p>普通怪生命 ×{s.stageDifficulty.healthMultiplier.toFixed(2)} · 首领与精英 ×{s.stageDifficulty.eliteHealthMultiplier.toFixed(2)}</p>}
       {difficulty&&<><p>普通怪生命 ×{difficulty.health.toFixed(2)} · 首领与精英 ×{difficulty.eliteHealth.toFixed(2)} · 伤害 ×{difficulty.damage.toFixed(2)}</p>
        <p>场上 {s.enemies.length} / {difficulty.limit} · 每 {(difficulty.interval/20).toFixed(2)} 秒刷 {difficulty.count} 只</p></>}
       {reward&&<p className="text-amber-100">预计结算 摩拉 {reward.mora} · 原石 {reward.primogems}</p>}
       {s.adventure&&<p>{eliteActive?'精英在场 · 丘丘岩盔王':'下次精英 · 第 '+(s.lastEliteWave+eliteWaveInterval)+' 波'}</p>}
       {s.artifactDrops.length>0&&<p className="text-emerald-200">圣遗物掉落 {s.artifactDrops.length} 件</p>}
      </div>
     </div>
    </details>
    <button type="button" disabled={pending||confirmExit||s.phase==='ended'} onClick={onPause} className={controlClass}>{s.phase==='paused'?'继续':'暂停'}</button>
    <button type="button" disabled={pending||confirmExit} onClick={onExit} className={controlClass}>退出</button>
   </div>
  </div>
  <div className={'grid gap-x-4 gap-y-0.5 '+(endless?'min-[380px]:grid-cols-2':'')}>
   <BattleMeter label="生命值" shortLabel="生命" value={s.hp} max={s.maxHp} color="health"/>
   {endless&&<BattleMeter label="作战经验" shortLabel={'Lv.'+s.level} value={s.experience} max={experienceRequired(s.level)} color="experience"/>}
  </div>
 </header>;
}
