import portraitFiles from '../../../../shared/character-portraits.json';
import referenceFiles from '../../../../shared/character-references.json';
import displaySheets from '../../../../shared/character-display-portraits.json';
import {useId} from 'react';

type PortraitAsset={readonly src:string;readonly thumbnail?:string};
const portraits:Readonly<Record<string,PortraitAsset>>=portraitFiles;
const references:Readonly<Record<string,PortraitAsset>>=referenceFiles;
const displayPortraits=Object.fromEntries(displaySheets.flatMap(sheet=>{
 const cellWidth=sheet.width/sheet.columns,cellHeight=sheet.height/sheet.rows;
 return sheet.characters.flatMap((id,index)=>{
  if(id===null)return [];
  const frame={x:index%sheet.columns*cellWidth,y:Math.floor(index/sheet.columns)*cellHeight,width:cellWidth,height:cellHeight};
  const mirrored=sheet.mirroredCharacters?.includes(id);
  return [[id,{src:sheet.src,width:sheet.width,height:sheet.height,frame,mirrored}]] as const;
 });
}));

export function hasDisplayPortrait(characterId:string):boolean{
 return Object.hasOwn(portraits,characterId)||Object.hasOwn(displayPortraits,characterId);
}

export function CharacterPortrait({characterId,label,className,x,y,width,height,walkOffset=0,framing='full',allowReference=false,usage='display'}:{characterId:string;label:string;className?:string;x?:number;y?:number;width?:number;height?:number;walkOffset?:number;framing?:'full'|'bust';allowReference?:boolean;usage?:'display'|'battle'}){
 const clipId=useId();
 const display=usage==='display'&&Object.hasOwn(displayPortraits,characterId)?displayPortraits[characterId]:undefined;
 if(display){
  const frame=display.frame;
  const viewBox=[frame.x,frame.y,frame.width,frame.height].join(' ');
  const transform=display.mirrored?'translate('+(2*frame.x+frame.width)+' 0) scale(-1 1)':undefined;
  return <svg viewBox={viewBox} x={x} y={y} width={width} height={height} className={className}
   role="img" aria-label={label} overflow="hidden" imageRendering="pixelated" data-portrait="gallery-pixel">
   <defs><clipPath id={clipId+'-display'}><rect {...frame}/></clipPath></defs>
   <g clipPath={'url(#'+clipId+'-display)'}>
    <image href={display.src} width={display.width} height={display.height} transform={transform}/>
   </g>
  </svg>;
 }
 const portrait=Object.entries(portraits).find(([id])=>id===characterId)?.[1];
 const offset=walkOffset*144/(height??144);
 const reference=allowReference?Object.entries(references).find(([id])=>id===characterId)?.[1]:undefined;
 if(!portrait&&reference)return <svg viewBox={framing==='bust'?'0 0 96 80':'0 0 96 144'} x={x} y={y} width={width} height={height} className={className} role="img" aria-label={label+'，原图'} overflow="hidden" data-portrait="reference-placeholder">
  <foreignObject width="96" height="144">
   <img src={reference.thumbnail??reference.src} alt="" loading="lazy" decoding="async" className={framing==='bust'?'h-full w-full object-cover':'h-full w-full object-contain'}/>
  </foreignObject>
 </svg>;
 if(portrait)return <svg viewBox={framing==='bust'?'14 0 68 80':'0 0 96 144'} x={x} y={y} width={width} height={height} className={className} role="img" aria-label={label} overflow={framing==='bust'?'hidden':'visible'} imageRendering="pixelated" data-portrait="reference-pixel">
  {walkOffset===0?<image href={width===undefined&&height===undefined?portrait.thumbnail??portrait.src:portrait.src} width="96" height="144" preserveAspectRatio="xMidYMax meet"/>:<>
   <defs><clipPath id={clipId+'-upper'}><rect width="96" height="104"/></clipPath><clipPath id={clipId+'-left'}><rect y="104" width="48" height="48"/></clipPath><clipPath id={clipId+'-right'}><rect x="48" y="104" width="48" height="48"/></clipPath></defs>
   <g clipPath={'url(#'+clipId+'-upper)'}><image href={portrait.src} width="96" height="144" preserveAspectRatio="xMidYMax meet"/></g>
   <g clipPath={'url(#'+clipId+'-left)'}><image href={portrait.src} y={offset} width="96" height="144" preserveAspectRatio="xMidYMax meet"/></g>
   <g clipPath={'url(#'+clipId+'-right)'}><image href={portrait.src} y={-offset} width="96" height="144" preserveAspectRatio="xMidYMax meet"/></g>
  </>}
 </svg>;
 return <svg viewBox={framing==='bust'?'0 0 96 80':'0 0 96 144'} x={x} y={y} width={width} height={height} className={className} role="img" aria-label={label+'，立绘待设计'} data-portrait="pending"><text x="48" y={framing==='bust'?42:74} textAnchor="middle" fill="#a8b1b5" fontSize="10" letterSpacing="1">立绘待设计</text></svg>;
}
