import {useEffect,useState} from 'react';
import {gameAsset} from '../../../system/gameAsset';

function installed(worker:ServiceWorker){
 return new Promise<void>((resolve,reject)=>{
  const check=()=>{
   if(worker.state==='activated'||worker.state==='redundant'){
    worker.removeEventListener('statechange',check);
    if(worker.state==='activated')resolve();
    else reject(new Error('Offline installation failed'));
   }
  };
  worker.addEventListener('statechange',check);
  check();
 });
}

export function OfflinePreparation(){
 const [state,setState]=useState<'idle'|'loading'|'ready'|'error'>('idle');
 const supported=import.meta.env.PROD&&'serviceWorker' in navigator;
 useEffect(()=>{
  if(!supported)return;
  navigator.serviceWorker.getRegistration().then(registration=>{
   if(registration?.active?.scriptURL===new URL(gameAsset('/sw.js'),location.href).href)setState('ready');
  }).catch(()=>{});
 },[supported]);
 if(!supported)return null;
 async function prepare(){
  setState('loading');
  try{
   const registration=await navigator.serviceWorker.register(gameAsset('/sw.js'));
   if(!registration.active){
    const worker=registration.installing??registration.waiting;
    if(!worker)throw new Error('Offline installation did not start');
    await installed(worker);
   }
   setState('ready');
  }catch{setState('error');}
 }
 return <div className="absolute right-4 top-4 text-right text-xs text-amber-50">
  {state==='ready'?<p role="status" className="rounded-full bg-slate-900/75 px-4 py-2">离线资源已就绪</p>:
   <button type="button" disabled={state==='loading'} onClick={prepare}
    className="rounded-full border border-amber-100/35 bg-slate-900/65 px-4 py-2 hover:bg-slate-900 disabled:opacity-60">
    {state==='loading'?'正在下载离线资源…':state==='error'?'下载失败，重试':'下载离线资源'}
   </button>}
 </div>;
}
