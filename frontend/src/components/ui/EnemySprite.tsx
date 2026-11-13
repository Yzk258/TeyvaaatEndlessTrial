import {memo} from 'react';
import appearance from '../../../../shared/enemy-appearance.json';
import {enemyDefinitions,type EnemyKind} from '../../game/objects/Enemy';
import {gameAsset} from '../../system/gameAsset';

export const enemySprites=(Object.keys(enemyDefinitions) as EnemyKind[]).map(kind=>{
 const {name,sheet:sheetIndex,cell}=appearance.sprites[kind];
 const sheet=appearance.sheets[sheetIndex];
 const width=sheet.width/sheet.columns,height=sheet.height/sheet.rows;
 const x=cell%sheet.columns*width,y=Math.floor(cell/sheet.columns)*height;
 return {kind,name,sheet,viewBox:[x,y,width,height].join(' ')};
});

type EnemySpriteFrame=(typeof enemySprites)[number];

function SpriteImage({sheet}:Pick<EnemySpriteFrame,'sheet'>){
 return <image href={gameAsset(sheet.src)} width={sheet.width} height={sheet.height} imageRendering="pixelated"/>;
}

export const EnemySpriteLibrary=memo(function EnemySpriteLibrary({prefix}:{prefix:string}){
 return <>{enemySprites.map(({kind,sheet,viewBox})=><symbol key={kind} id={prefix+'-'+kind} viewBox={viewBox} overflow="hidden">
  <SpriteImage sheet={sheet}/>
 </symbol>)}</>;
});

export function EnemySprite({sprite,className}:{sprite:EnemySpriteFrame;className?:string}){
 return <svg aria-hidden="true" viewBox={sprite.viewBox} overflow="hidden" className={className}>
  <SpriteImage sheet={sprite.sheet}/>
 </svg>;
}
