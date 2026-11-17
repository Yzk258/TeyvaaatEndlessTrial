type Area={readonly x:number;readonly y:number;readonly delay:number};
export type HypostasisZone=Area&(
 | {readonly kind:'circle';readonly radius:number}
 | {readonly kind:'ring';readonly radius:number;readonly innerRadius:number}
 | {readonly kind:'line';readonly endX:number;readonly endY:number;readonly halfWidth:number}
);
export type HypostasisCue={
 readonly name:string;
 readonly startTick:number;
 readonly strikeTick:number;
 readonly endTick:number;
 readonly exposesCore:boolean;
 readonly zones:readonly HypostasisZone[];
};
export type HypostasisState={
 readonly maxHp:number;
 readonly attacks:number;
 readonly cue?:HypostasisCue;
};
