export const rewardCurrencyLabels={mora:'摩拉',primogems:'原石'} as const;
export type RewardCurrency=keyof typeof rewardCurrencyLabels;

export type TrialReward={
 readonly kind:'currency';
 readonly currency:RewardCurrency;
 readonly amount:number;
};
