import type {AdventurePlan} from '../../objects/AdventurePlan';
export const eliteWaveInterval=10;
export function adventureDifficulty(plan:AdventurePlan,ticks:number){
 const r=plan.rules,wave=Math.floor(ticks/(20*r.stepSeconds));
 return {wave:wave+1,health:plan.difficulty.healthMultiplier*(1+wave*r.healthGrowthPercent/100),
  eliteHealth:plan.difficulty.eliteHealthMultiplier*(1+wave*r.healthGrowthPercent/100),
  damage:1+wave*r.damageGrowthPercent/100,
  interval:Math.max(r.minSpawnIntervalTicks,r.baseSpawnIntervalTicks-wave),
  count:Math.min(r.maxSpawnCount,1+Math.floor(wave/r.spawnCountStepWaves)),
  limit:Math.min(r.maxEnemyLimit,r.baseEnemyLimit+wave*r.enemyLimitPerWave)};
}
export function adventureReward(plan:AdventurePlan,kills:number,ticks:number){
 const r=plan.rules,blocks=Math.floor(ticks/(20*r.timeBlockSeconds));
 const multiplier=plan.difficulty.rewardMultiplier;
 return {mora:(blocks*r.moraPerTimeBlock+kills*r.moraPerKill)*multiplier,
  primogems:(blocks*r.primogemsPerTimeBlock+Math.floor(kills/r.killBlock)*r.primogemsPerKillBlock)*multiplier};
}
