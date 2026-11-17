import type {ElementalCrystal} from '../../objects/ElementalCrystal';
import {gameAsset} from '../../system/gameAsset';

export function ElementalCrystalIcon({crystal,size=32}:{crystal:ElementalCrystal;size?:number}){
 return <img src={gameAsset('/crystals/'+crystal.id+'.png')} alt="" draggable={false}
  width={size} height={size} className="shrink-0 object-contain [image-rendering:pixelated]"/>;
}
