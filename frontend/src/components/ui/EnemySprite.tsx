import {memo} from 'react';
import appearance from '../../../../shared/enemy-appearance.json';
import type {EnemyKind} from '../../game/objects/Enemy';
import {elements,type Element} from '../../objects/Element';
import {hypostases} from '../../objects/Hypostasis';
import {gameAsset} from '../../system/gameAsset';

const ordinarySprites=(Object.keys(appearance.sprites) as (keyof typeof appearance.sprites)[]).map(kind=>{
 const {name,sheet:sheetIndex,cell}=appearance.sprites[kind];
 const sheet=appearance.sheets[sheetIndex];
 const width=sheet.width/sheet.columns,height=sheet.height/sheet.rows;
 const x=cell%sheet.columns*width,y=Math.floor(cell/sheet.columns)*height;
 return {kind,name,sheet,viewBox:[x,y,width,height].join(' ')};
});

type EnemySpriteFrame={kind:EnemyKind;name:string;viewBox:string;sheet:{src:string;width:number;height:number}};
export function hypostasisSprite(element:Element):EnemySpriteFrame{
 return {
 kind:`hypostasis-${element}`,name:hypostases[element].name,viewBox:'0 0 96 96',
 sheet:{src:`/enemies/hypostasis/${element}.png`,width:96,height:96}
 };
}
export const enemySprites:readonly EnemySpriteFrame[]=[...ordinarySprites,...elements.map(hypostasisSprite)];

function SpriteImage({sheet}:Pick<EnemySpriteFrame,'sheet'>){
 return <image href={gameAsset(sheet.src)} width={sheet.width} height={sheet.height} imageRendering="pixelated"/>;
}

export const EnemySpriteLibrary=memo(function EnemySpriteLibrary({prefix,bossElement}:{prefix:string;bossElement:Element|null}){
 const sprites=bossElement?[hypostasisSprite(bossElement)]:ordinarySprites;
 return <>{sprites.map(({kind,sheet,viewBox})=><symbol key={kind} id={prefix+'-'+kind} viewBox={viewBox} overflow="hidden">
  <SpriteImage sheet={sheet}/>
 </symbol>)}</>;
});

export function EnemySprite({sprite,className}:{sprite:EnemySpriteFrame;className?:string}){
 return <svg aria-hidden="true" viewBox={sprite.viewBox} overflow="hidden" className={className}>
  <SpriteImage sheet={sprite.sheet}/>
 </svg>;
}
