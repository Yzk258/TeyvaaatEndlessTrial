import type {WishReward} from '../../../objects/WishReward';
export type WishReveal=WishReward&{readonly duplicate:boolean;readonly sequence:string};
