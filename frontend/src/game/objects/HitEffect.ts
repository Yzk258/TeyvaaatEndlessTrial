import type {Enemy} from './BattleState';
export type HitEffect={readonly id:string;readonly enemyId:number;readonly enemyKind:Enemy['kind'];readonly x:number;readonly y:number;readonly angle:number;readonly damage:number;readonly defeated:boolean;readonly life:number};
export type PlayerHitEffect={readonly tick:number;readonly x:number;readonly y:number;readonly angle:number;readonly damage:number};
export const playerHitTicks=12;
