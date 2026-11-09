export type AttackEffect=
 | {readonly kind:'meleeArc';readonly id:number;readonly x:number;readonly y:number;readonly angle:number;readonly angleDegrees:number;readonly radius:number;readonly life:number}
 | {readonly kind:'area';readonly id:number;readonly x:number;readonly y:number;readonly radius:number;readonly life:number};
