import sprites from '../../../../../shared/enemy-appearance.json';
import type {PixelSprite} from '../../../objects/PixelSprite';
import {PixelArtwork} from '../../../components/ui/PixelArtwork';
import type {Enemy} from '../../../game/objects/BattleState';
import type {HitEffect} from '../../../game/objects/HitEffect';

const enemyNames:Readonly<Record<Enemy['kind'],string>>={slime:'史莱姆',hilichurl:'丘丘人',boss:'暴徒首领'};
export function EnemyPortrait({enemy,tick,hit,reducedMotion=false}:{enemy:Enemy;tick:number;hit?:HitEffect;reducedMotion?:boolean}){
 const sprite:PixelSprite=sprites[enemy.kind];
 const width=enemy.kind==='boss'?72:enemy.kind==='hilichurl'?40:32;
 const height=enemy.kind==='boss'?84:enemy.kind==='hilichurl'?48:32;
 const bob=enemy.kind==='slime'&&!reducedMotion?Math.floor(Math.sin((tick+enemy.id)/4)*2):0;
 const kick=hit&&!reducedMotion?Math.sin((10-hit.life)*Math.PI/6)*Math.max(0,hit.life-4)/2:0;
 return <g role="img" aria-label={enemyNames[enemy.kind]}>
  <ellipse cx={enemy.x} cy={enemy.y+height*.32} rx={width*.33} ry="4" fill="#10241f" opacity=".3"/>
  <svg x={enemy.x-width/2+Math.cos(hit?.angle??0)*kick} y={enemy.y-height*.6+bob+Math.sin(hit?.angle??0)*kick} width={width} height={height} viewBox={'0 0 '+sprite.width+' '+sprite.height} filter={hit&&hit.life>=8?'url(#battle-hit-flash)':undefined}><PixelArtwork sprite={sprite}/></svg>
 </g>;
}
