import {useCallback,useEffect,useReducer,useRef,useState} from 'react';
import {wishAnimationPhase,wishMeteorStagger} from '../functions/wishAnimationPhase';
export function useWishAnimation(pullCount:number){
 const [phase,dispatch]=useReducer(wishAnimationPhase,'gathering');
 const [revealImmediately,setRevealImmediately]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const skip=useCallback(()=>{
  setRevealImmediately(true);
  dispatch({kind:'skip'});
 },[]);
 useEffect(()=>{
  const element=dialog.current;
  element?.showModal();
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{if(motion.matches)skip();};
  update();motion.addEventListener('change',update);
  return ()=>{motion.removeEventListener('change',update);element?.close();};
 },[skip]);
 useEffect(()=>{
  if(phase==='reveal')return;
  const duration=phase==='gathering'?850:1300+(pullCount-1)*wishMeteorStagger;
  const timer=window.setTimeout(()=>dispatch({kind:'advance'}),duration);
  return ()=>window.clearTimeout(timer);
 },[phase,pullCount]);
 return {phase,dialog,skip,revealImmediately};
}
