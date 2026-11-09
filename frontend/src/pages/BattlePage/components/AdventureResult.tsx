import {adventureReward} from '../../../game/functions/adventureProgress';
import type {BattleState} from '../../../game/objects/BattleState';
export function AdventureResult({state:s}:{state:BattleState}){
 if(!s.adventure)return null;
 const reward=adventureReward(s.adventure,s.kills,s.combatTicks);
 return <div className="space-y-2"><p className="text-amber-100">摩拉 +{reward.mora.toLocaleString()}　·　原石 +{reward.primogems}</p><p className="text-xs text-stone-400">包含击杀所得摩拉；未吸收的掉落也按已击杀数量结算。</p></div>;
}
