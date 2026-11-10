import {stages} from '../../objects/Stage';

export function StagesPage({onStart,pending,clearedStages}:{onStart:(id:string)=>void;pending:boolean;clearedStages:readonly string[]}){
 return <section className="space-y-8">
  <header data-tutorial-target="stage-intro">
   <p className="text-xs tracking-[.3em] text-emerald-100/50">EXPEDITION CHALLENGES</p>
   <h1 className="mt-4 font-serif text-4xl text-amber-50">关卡挑战</h1>
   <p className="mt-4 text-sm leading-7 text-stone-400">击败本关全部敌人即可通关。每次成功挑战均可获得所列奖励。</p>
   <p className="text-xs text-stone-500">使用角色培养页当前选中的角色。</p>
  </header>
  <div className="grid gap-5 md:grid-cols-3">{stages.map((stage,i)=>
   <article key={stage.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-100/5 to-transparent p-7 transition duration-200 hover:-translate-y-1 hover:border-emerald-100/30 hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,.75)]">
    <div className="flex items-center justify-between gap-3">
     <p className="text-xs tracking-widest text-stone-500">挑战 0{i+1}</p>
     {clearedStages.includes(stage.id)&&<span className="text-xs text-emerald-200">已通关</span>}
    </div>
    <div className="py-8 text-5xl text-emerald-100/40">✧</div>
    <h2 className="font-serif text-2xl text-amber-50">{stage.title}</h2>
    <p className="mt-4 text-sm text-stone-300">{stage.enemies} 名敌人 · 全部击败通关</p>
    <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-amber-100">摩拉 +{stage.mora}<br/>原石 +{stage.primogems}</p>
    <button disabled={pending} onClick={()=>onStart(stage.id)} className="mt-6 rounded-full bg-amber-100 px-6 py-3 text-sm text-slate-900 disabled:opacity-40">开始挑战 →</button>
   </article>)}</div>
 </section>;
}
