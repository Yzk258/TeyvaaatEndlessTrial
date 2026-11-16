import type {ElementalCrystal} from './ElementalCrystal';

const rewardCurrencyLabels={mora:'摩拉',primogems:'原石'} as const;
export type RewardCurrency=keyof typeof rewardCurrencyLabels;

export type TrialReward={
 readonly kind:'currency';
 readonly currency:RewardCurrency;
 readonly amount:number;
}|{readonly kind:'elementalCrystal';readonly crystal:ElementalCrystal;readonly amount:number};

export function formatTrialReward(reward:TrialReward):string{
 const name=reward.kind==='currency'?rewardCurrencyLabels[reward.currency]:reward.crystal.name;
 return name+' +'+reward.amount.toLocaleString();
}
