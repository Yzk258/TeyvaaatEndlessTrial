export function DismantleButton({label,equipped,pending,onClick}:{label:'武器'|'圣遗物';equipped:boolean;pending:boolean;onClick:()=>void}){
 return <button type="button" disabled={pending||equipped} onClick={onClick}
  className="rounded-full border border-rose-200/30 px-4 py-2 text-xs text-rose-100 enabled:hover:bg-rose-200/10 disabled:opacity-45">
  {equipped?'已装备，需先卸下':'分解'+label}
 </button>;
}
