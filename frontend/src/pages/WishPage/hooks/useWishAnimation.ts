import {useEffect,useReducer,useRef} from 'react';
import {wishAnimationPhase} from '../functions/wishAnimationPhase';
export function useWishAnimation(){
 const [phase,dispatch]=useReducer(wishAnimationPhase,'gathering');
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const element=dialog.current;
  element?.showModal();
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{if(motion.matches)dispatch({kind:'skip'});};
  update();motion.addEventListener('change',update);
  return ()=>{motion.removeEventListener('change',update);element?.close();};
 },[]);
 useEffect(()=>{
  if(phase==='reveal')return;
  const timer=window.setTimeout(()=>dispatch({kind:'advance'}),phase==='gathering'?850:1300);
  return ()=>window.clearTimeout(timer);
 },[phase]);
 return {phase,dialog,skip:()=>dispatch({kind:'skip'})};
}
