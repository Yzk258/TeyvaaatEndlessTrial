import {Star} from 'lucide-react';

export function CharacterFavoriteButton({name,favorite,disabled,onClick}:{name:string;favorite:boolean;disabled:boolean;onClick:()=>void}){
 return <button type="button" aria-label={'收藏'+name} aria-pressed={favorite}
  title={favorite?'取消收藏':'收藏角色'} disabled={disabled} onClick={onClick}
  className={'absolute bottom-3 right-3 inline-flex size-10 items-center justify-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 disabled:opacity-50 '+(favorite
   ?'border-amber-300/60 bg-amber-300/15 text-amber-200 enabled:hover:bg-amber-300/25'
   :'border-white/15 bg-[#142129] text-stone-300 enabled:hover:border-amber-100/60 enabled:hover:text-amber-100')}>
  <Star size={18} fill={favorite?'currentColor':'none'} aria-hidden="true"/>
 </button>;
}
