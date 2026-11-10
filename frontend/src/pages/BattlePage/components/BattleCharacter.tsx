import type {Character} from '../../../objects/Character';
import type {BattleState} from '../../../game/objects/BattleState';
import {BattlePortrait} from '../../../components/ui/BattlePortrait';
import {CharacterPortrait} from '../../../components/ui/CharacterPortrait';
import {characterPose} from '../functions/characterPose';

export function BattleCharacter({state:s,character,reducedMotion}:{state:BattleState;character:Character;reducedMotion:boolean}){
 const pose=characterPose(s.motion,s.facing,s.attackCue,s.tick,reducedMotion);
 const hit=s.playerHits?.at(-1);
 const age=hit?s.tick-hit.tick:Infinity;
 const recoil=age>=0&&age<6&&!reducedMotion?(1-age/6)*(age%2===0?6:2):0;
 const hitX=Math.cos(hit?.angle??0)*recoil,hitY=Math.sin(hit?.angle??0)*recoil;
 const flash=age>=0&&age<2&&!reducedMotion;
 return <g data-character-motion={s.motion.moving?'walking':'idle'} transform={'translate('+s.x+' '+s.y+')'}
  className={reducedMotion?undefined:'transition-transform duration-[50ms] ease-linear'}>
  <ellipse cy="19" rx="13" ry="4" fill="#10241f" opacity=".35"/>
  <g transform={'translate('+(pose.recoilX+hitX)+' '+(pose.recoilY+pose.bob+hitY)+') rotate('+(pose.tilt+hitX*.6)+') scale('+pose.scaleX+' '+pose.scaleY+')'}
   filter={flash?'url(#battle-hit-flash)':undefined}>
   <BattlePortrait characterId={character.id} label={character.name} x={-23} y={-27} size={46}
    fallback={<CharacterPortrait characterId={character.id} label={character.name} x={-20} y={-35} width={40} height={55} walkOffset={pose.leftFoot} usage="battle"/>}/>
  </g>
 </g>;
}
