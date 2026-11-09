import {useEffect,useState} from 'react';
export function useBattlePresentation(runId:string|null){
 const [visibleRun,setVisibleRun]=useState<string|null>(null);
 useEffect(()=>{
  if(!runId){setVisibleRun(null);return;}
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=window.setTimeout(()=>setVisibleRun(runId),reduced?0:350);
  return ()=>window.clearTimeout(timer);
 },[runId]);
 return {battleVisible:runId!==null&&visibleRun===runId,transitioning:runId!==null&&visibleRun!==runId};
}
