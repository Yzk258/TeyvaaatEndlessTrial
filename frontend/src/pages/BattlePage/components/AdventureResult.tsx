import {adventureReward} from '../../../game/functions/adventureProgress';
import type {BattleState} from '../../../game/objects/BattleState';
import {artifacts} from '../../../objects/Artifact';
export function AdventureResult({state:s}:{state:BattleState}){
 if(!s.adventure)return null;
 const reward=adventureReward(s.adventure,s.kills,s.combatTicks);
 return <div className="space-y-2">
  <p className="text-amber-100">摩拉 +{reward.mora.toLocaleString()}　·　原石 +{reward.primogems}</p>
  {s.artifactDrops.length>0&&<ul aria-label="圣遗物掉落" className="flex flex-wrap justify-center gap-2 text-sm text-emerald-200">
   {artifacts.map(item=>{
    const count=s.artifactDrops.filter(id=>id===item.id).length;
    return count>0?<li key={item.id}>{item.name} ×{count}</li>:null;
   })}
  </ul>}
  <p className="text-xs text-stone-400">已掉落的摩拉和圣遗物会在结算时一并领取。</p>
 </div>;
}
