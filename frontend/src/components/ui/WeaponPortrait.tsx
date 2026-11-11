import appearances from '../../../../shared/weapon-appearance.json';
import {gameAsset} from '../../system/gameAsset';
export function WeaponPortrait({weaponId,label,className,silhouette=false}:{weaponId:string;label:string;className?:string;silhouette?:boolean}){
 const appearance=Object.entries(appearances).find(([id])=>id===weaponId)?.[1];
 const filter=silhouette?' brightness-0':'';
 return appearance?<img src={gameAsset(appearance.src)} alt={label} draggable={false} className={'select-none object-contain [image-rendering:pixelated] '+(className??'h-40 w-full')+filter}/>:<span aria-label={label} className={(className??'')+filter}>✧</span>;
}
