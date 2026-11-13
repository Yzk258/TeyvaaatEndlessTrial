import referenceFiles from '../../../../shared/character-references.json';
import displaySheets from '../../../../shared/character-display-portraits.json';
import {useId} from 'react';
import {gameAsset} from '../../system/gameAsset';

type PortraitAsset={readonly src:string;readonly thumbnail?:string};
const references:Readonly<Record<string,PortraitAsset>>=referenceFiles;
const displayPortraits=Object.fromEntries(displaySheets.flatMap(sheet=>{
 const cellWidth=sheet.width/sheet.columns,cellHeight=sheet.height/sheet.rows;
 return sheet.characters.flatMap((id,index)=>{
  if(id===null)return [];
  const frame={x:index%sheet.columns*cellWidth,y:Math.floor(index/sheet.columns)*cellHeight,width:cellWidth,height:cellHeight};
  const mirrored=sheet.mirroredCharacters?.includes(id);
  return [[id,{src:gameAsset(sheet.src),width:sheet.width,height:sheet.height,frame,mirrored}]] as const;
 });
}));

export function hasDisplayPortrait(characterId:string):boolean{
 return Object.hasOwn(displayPortraits,characterId);
}

export function CharacterPortrait({characterId,label,className,x,y,width,height,framing='full',allowReference=false,silhouette=false}:{characterId:string;label:string;className?:string;x?:number;y?:number;width?:number;height?:number;framing?:'full'|'bust';allowReference?:boolean;silhouette?:boolean}){
 const clipId=useId();
 const portraitClassName=silhouette?'brightness-0 '+(className??''):className;
 const display=Object.hasOwn(displayPortraits,characterId)?displayPortraits[characterId]:undefined;
 if(display){
  const frame=display.frame;
  const viewBox=[frame.x,frame.y,frame.width,frame.height].join(' ');
  const transform=display.mirrored?'translate('+(2*frame.x+frame.width)+' 0) scale(-1 1)':undefined;
  return <svg viewBox={viewBox} x={x} y={y} width={width} height={height} className={portraitClassName}
   role="img" aria-label={label} overflow="hidden" imageRendering="pixelated" data-portrait="gallery-pixel">
   <defs><clipPath id={clipId+'-display'}><rect {...frame}/></clipPath></defs>
   <g clipPath={'url(#'+clipId+'-display)'}>
    <image href={display.src} width={display.width} height={display.height} transform={transform}/>
   </g>
  </svg>;
 }
 const reference=allowReference&&Object.hasOwn(references,characterId)?references[characterId]:undefined;
 if(reference)return <svg viewBox={framing==='bust'?'0 0 96 80':'0 0 96 144'} x={x} y={y} width={width} height={height} className={portraitClassName} role="img" aria-label={label+'，原图'} overflow="hidden" data-portrait="reference-placeholder">
  <foreignObject width="96" height="144">
   <img src={gameAsset(reference.thumbnail??reference.src)} alt="" loading="lazy" decoding="async" className={framing==='bust'?'h-full w-full object-cover':'h-full w-full object-contain'}/>
  </foreignObject>
 </svg>;
 return <svg viewBox={framing==='bust'?'0 0 96 80':'0 0 96 144'} x={x} y={y} width={width} height={height} className={className} role="img" aria-label={label+'，立绘待设计'} data-portrait="pending"><text x="48" y={framing==='bust'?42:74} textAnchor="middle" fill="#a8b1b5" fontSize="10" letterSpacing="1">立绘待设计</text></svg>;
}
