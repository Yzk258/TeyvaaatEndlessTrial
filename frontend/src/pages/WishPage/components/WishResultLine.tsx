import type {WishPulls} from '../../../objects/WishReward';
import {characters} from '../../../objects/Character';
import {weapons} from '../../../objects/Weapon';
import {RarityBadge} from '../../../components/ui/RarityBadge';
export function WishResultLine({result}:{result:WishPulls|null}){
 if(!result)return null;
 if(result.length>1){
  const five=result.filter(({reward})=>reward.rarity===5).length;
  const four=result.filter(({reward})=>reward.rarity===4).length;
  return <p role="status" className="text-sm text-amber-100">十连结果 · 五星 {five} · 四星 {four} · 三星 {result.length-five-four}</p>;
 }
 const [{reward,duplicate}]=result;
 const name=(reward.kind==='character'?characters:weapons).find(item=>item.id===reward.id)?.name??reward.id;
 return <p role="status" className="text-sm text-amber-100"><RarityBadge rarity={reward.rarity}/><span className="ml-3">获得 {name}{duplicate?(reward.kind==='character'?' · 印记 +1':' · 重复记录 +1'):reward.kind==='character'?' · 新伙伴':' · 新武器'}</span></p>;
}
