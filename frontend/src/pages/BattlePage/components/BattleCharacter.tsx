import type {Character} from '../../../objects/Character';
import type {BattleState} from '../../../game/objects/BattleState';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {characterPose} from '../functions/characterPose';
export function BattleCharacter({state:s,character,reducedMotion}:{state:BattleState;character:Character;reducedMotion:boolean}){
 const pose=characterPose(s.motion,s.facing,s.attackCue,s.tick,reducedMotion);
 return <g data-character-motion={s.motion.moving?'walking':'idle'}>
  <ellipse cx={s.x} cy={s.y+19} rx="13" ry="4" fill="#10241f" opacity=".35"/>
  <g transform={'translate('+(s.x+pose.recoilX)+' '+(s.y+pose.recoilY+pose.bob)+') rotate('+pose.tilt+') scale('+pose.scaleX+' '+pose.scaleY+')'}>
   {character.id==='hu-tao'
    ? <image href="/characters/pixel/hu-tao-battle-chibi.png" x={-23} y={-27} width={46} height={46} className="[image-rendering:pixelated]" role="img" aria-label={character.name}/>
    : <CharacterPortrait characterId={character.id} label={character.name} x={-20} y={-35} width={40} height={55} walkOffset={pose.leftFoot}/>}
  </g>
 </g>;
}
