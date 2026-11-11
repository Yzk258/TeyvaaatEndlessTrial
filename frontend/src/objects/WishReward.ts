import type {Rarity} from './Rarity';
export type WishCount=1|10;
export type WishBanner='character'|'weapon';
export type WishReward=
 | {readonly kind:'character';readonly id:string;readonly rarity:4|5}
 | {readonly kind:'weapon';readonly id:string;readonly rarity:Rarity};

export type WishPull={readonly reward:WishReward;readonly duplicate:boolean};
export type WishPulls=readonly [WishPull,...WishPull[]];
