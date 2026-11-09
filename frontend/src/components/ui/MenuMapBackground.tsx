import {useEffect,useState} from 'react';
import {MapTerrain} from '../../pages/BattlePage/components/MapTerrain';
import {CHUNK_SIZE} from '../../game/functions/generateMap';
export function MenuMapBackground(){
 const [camera,setCamera]=useState({x:450,y:270});
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const timer=window.setInterval(()=>{if(!media.matches&&!document.hidden)setCamera(p=>({x:p.x+.65,y:p.y+.22}));},50);
  return ()=>window.clearInterval(timer);
 },[]);
 return <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#263d30]"><svg className="h-full w-full" viewBox="0 0 900 540" preserveAspectRatio="xMidYMid slice"><g transform={'translate('+(450-camera.x)+' '+(270-camera.y)+')'}><MapTerrain seed={20261108} adventure={true} chunkX={Math.floor(camera.x/CHUNK_SIZE)} chunkY={Math.floor(camera.y/CHUNK_SIZE)}/></g></svg><div className="absolute inset-0 bg-[#0c1823]/70"/></div>;
}
