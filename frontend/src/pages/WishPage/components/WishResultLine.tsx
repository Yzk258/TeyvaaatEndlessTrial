import type {WishResult} from '../../../objects/Profile';
import {characters} from '../../../objects/Character';
import {weapons} from '../../../objects/Weapon';
import {RarityBadge} from '../../../components/ui/RarityBadge';
export function WishResultLine({result}:{result:WishResult|null}){
 if(!result)return null;
 const reward=result.reward;
 const name=(reward.kind==='character'?characters:weapons).find(item=>item.id===reward.id)?.name??reward.id;
 return <p role="status" className="text-sm text-amber-100"><RarityBadge rarity={reward.rarity}/><span className="ml-3">获得 {name}{result.duplicate?(reward.kind==='character'?' · 印记 +1':' · 重复记录 +1'):reward.kind==='character'?' · 新伙伴':' · 新武器'}</span></p>;
}
