export type LootParticle={readonly id:string;readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;readonly phase:'scatter'|'attract'|'absorbed';readonly age:number}&(
 | {readonly kind:'experience'|'mora';readonly value:number}
 | {readonly kind:'artifact';readonly artifactId:string}
);
