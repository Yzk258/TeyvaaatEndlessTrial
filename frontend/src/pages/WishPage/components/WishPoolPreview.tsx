import {characters} from '../../../objects/Character';
import {weapons} from '../../../objects/Weapon';
import {RarityBadge} from '../../../components/ui/RarityBadge';
export function WishPoolPreview({banner}:{banner:'character'|'weapon'}){
 return <details className="mt-5 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm text-stone-300">查看卡池内容与规则</summary><div className="mt-4 space-y-4">{([5,4,3] as const).map(rarity=><div key={rarity}><RarityBadge rarity={rarity}/><p className="mt-2 text-xs leading-6 text-stone-400">{[...(banner==='character'?characters.filter(c=>c.inStandardBanner&&c.rarity===rarity).map(c=>c.name+'（角色）'):[]),...weapons.filter(w=>w.rarity===rarity&&(banner==='weapon'||rarity!==5)).map(w=>w.name)].join('、')}</p></div>)}<p className="border-t border-white/10 pt-3 text-xs leading-6 text-stone-400">参考原神基础概率与保底，软保底采用统计模型。当前无指定UP与定轨；武器池仅产出武器。重复角色记录印记，每次获得武器都增加一把。</p></div></details>;
}
