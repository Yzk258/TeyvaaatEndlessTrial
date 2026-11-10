import type {ReactNode} from 'react';
import portraitSheets from '../../../../shared/character-battle-portraits.json';
import {gameAsset} from '../../system/gameAsset';

const battlePortraits=new Map(portraitSheets.flatMap(sheet=>{
 const cellWidth=sheet.width/sheet.columns,cellHeight=sheet.height/sheet.rows;
 return sheet.characters.flatMap((id,index)=>{
  if(id===null)return [];
  const x=index%sheet.columns*cellWidth,y=Math.floor(index/sheet.columns)*cellHeight;
  return [[id,{src:gameAsset(sheet.src),width:sheet.width,height:sheet.height,viewBox:[x,y,cellWidth,cellHeight].join(' ')}]] as const;
 });
}));

type BattlePortraitProps={
 characterId:string;label:string;className?:string;x?:number;y?:number;size?:number;fallback?:ReactNode;
};

export function BattlePortrait({characterId,label,className,x,y,size,fallback=null}:BattlePortraitProps){
 const portrait=battlePortraits.get(characterId);
 if(!portrait)return fallback;
 return <svg x={x} y={y} width={size} height={size} className={className} viewBox={portrait.viewBox} overflow="hidden"
  imageRendering="pixelated" role="img" aria-label={label} data-portrait="battle-chibi">
  <image href={portrait.src} width={portrait.width} height={portrait.height}/>
 </svg>;
}
