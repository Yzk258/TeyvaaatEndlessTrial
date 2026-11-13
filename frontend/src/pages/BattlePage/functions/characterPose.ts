import type {CharacterMotion} from '../../../game/objects/CharacterMotion';
import type {AttackCue} from '../../../game/objects/AttackCue';
export function characterPose(motion:CharacterMotion,facing:number,cue:AttackCue|null,tick:number,reducedMotion:boolean){
 const age=cue?tick-cue.tick:8;
 const attacking=!!cue&&age>=0&&age<8;
 const angle=attacking?cue.angle:facing;
 const pulse=attacking&&!reducedMotion?Math.sin(Math.PI*age/8):0;
 const step=motion.moving&&!reducedMotion?Math.sin(motion.distance/9):0;
 return {
  bob:step===0?0:-Math.round(Math.abs(step)*2),tilt:step*2-Math.cos(angle)*pulse*5,
  scaleX:(Math.cos(angle)<-0.1?-1:1)*(1-pulse*.04),scaleY:1+pulse*.05,
  recoilX:-Math.cos(angle)*pulse*3,recoilY:-Math.sin(angle)*pulse*2
 };
}
