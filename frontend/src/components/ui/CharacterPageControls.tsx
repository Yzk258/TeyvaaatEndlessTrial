export function CharacterPageControls({index,count,onChange}:{index:number;count:number;onChange:(index:number)=>void}){
 if(count<=1)return null;
 const buttonClass='rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-40';
 return <nav className="flex items-center justify-center gap-4" aria-label="角色列表分页">
  <button type="button" className={buttonClass} disabled={index===0} onClick={()=>onChange(index-1)}>上一页</button>
  <span className="text-sm text-stone-400" aria-live="polite">第 {index+1} / {count} 页</span>
  <button type="button" className={buttonClass} disabled={index===count-1} onClick={()=>onChange(index+1)}>下一页</button>
 </nav>;
}
