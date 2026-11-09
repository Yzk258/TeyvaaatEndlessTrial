import {memo,useMemo} from 'react';
import type {PixelSprite} from '../../objects/PixelSprite';

export const PixelArtwork=memo(function PixelArtwork({sprite}:{sprite:PixelSprite}){
 const paths=useMemo(()=>Object.entries(sprite.palette).map(([key,color])=>({
  color,path:sprite.rows.flatMap((row,y)=>[...row].flatMap((pixel,x)=>pixel===key?['M'+x+' '+y+'h1v1h-1Z']:[])).join('')
 })),[sprite]);
 return <g shapeRendering="crispEdges">{paths.map(({color,path})=><path key={color} d={path} fill={color}/>)}</g>;
});
