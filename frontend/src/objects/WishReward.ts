import type {Rarity} from './Rarity';
export type WishReward=
 | {readonly kind:'character';readonly id:string;readonly rarity:4|5}
 | {readonly kind:'weapon';readonly id:string;readonly rarity:Rarity};
