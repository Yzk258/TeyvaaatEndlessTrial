import appearances from '../../../../shared/weapon-appearance.json';
export function WeaponPortrait({weaponId,label,className}:{weaponId:string;label:string;className?:string}){
 const appearance=Object.entries(appearances).find(([id])=>id===weaponId)?.[1];
 return appearance?<img src={appearance.src} alt={label} draggable={false} className={'select-none object-contain [image-rendering:pixelated] '+(className??'h-40 w-full')}/>:<span aria-label={label} className={className}>✧</span>;
}
