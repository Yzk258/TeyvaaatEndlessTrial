import type {WishCount,WishPulls} from '../../../objects/WishReward';
import {WishResultLine} from './WishResultLine';

export type WishActionsProps={
 pending:boolean;
 onWish:(count:WishCount)=>void;
 result:WishPulls|null;
 singleLabel?:string;
};

export function WishActions({pending,onWish,result,singleLabel='祈愿一次'}:WishActionsProps){
 return <div className="relative mt-7 space-y-4">
  <div className="flex flex-wrap gap-3" aria-busy={pending}>
   <button type="button" disabled={pending} onClick={()=>onWish(1)}
    className="rounded-full border border-amber-100/35 px-6 py-3 text-sm font-medium text-amber-100 enabled:hover:bg-amber-100/10 disabled:opacity-40">
    <span aria-hidden="true">✧ </span>{singleLabel} · 1 纠缠之缘
   </button>
   <button type="button" disabled={pending} onClick={()=>onWish(10)}
    className="rounded-full bg-[#e8dbc2] px-6 py-3 text-sm font-medium text-slate-900 enabled:hover:bg-amber-50 disabled:opacity-40">
    十连祈愿 · 10 纠缠之缘
   </button>
  </div>
  <WishResultLine result={result}/>
 </div>;
}
