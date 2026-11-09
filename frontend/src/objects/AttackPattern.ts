export type AttackPattern=
 | {readonly kind:'projectile';readonly speed:number;readonly radius:number;readonly pierce:number}
 | {readonly kind:'meleeArc';readonly angleDegrees:number}
 | {readonly kind:'area';readonly splashRadius:number};
export const attackPatternLabels:Readonly<Record<AttackPattern['kind'],string>>={projectile:'投射物',meleeArc:'近战扇形',area:'目标范围'};
export function isAttackPattern(value:unknown):value is AttackPattern {
 if(typeof value!=='object'||value===null)return false;
 const v=value as Record<string,unknown>;
 switch(v.kind){
  case 'projectile':return typeof v.speed==='number'&&Number.isFinite(v.speed)&&v.speed>0&&typeof v.radius==='number'&&Number.isFinite(v.radius)&&v.radius>0&&typeof v.pierce==='number'&&Number.isInteger(v.pierce)&&v.pierce>=0;
  case 'meleeArc':return typeof v.angleDegrees==='number'&&Number.isFinite(v.angleDegrees)&&v.angleDegrees>0&&v.angleDegrees<=360;
  case 'area':return typeof v.splashRadius==='number'&&Number.isFinite(v.splashRadius)&&v.splashRadius>0;
  default:return false;
 }
}
