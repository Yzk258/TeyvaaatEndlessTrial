import type {AdventurePlan} from '../../objects/AdventurePlan';
export function adventureDifficulty(plan:AdventurePlan,ticks:number){
 const r=plan.rules,wave=Math.floor(ticks/(20*r.stepSeconds));
 return {wave:wave+1,health:1+wave*r.healthGrowthPercent/100,damage:1+wave*r.damageGrowthPercent/100,
  interval:Math.max(r.minSpawnIntervalTicks,r.baseSpawnIntervalTicks-wave),
  count:Math.min(r.maxSpawnCount,1+Math.floor(wave/r.spawnCountStepWaves)),
  limit:Math.min(r.maxEnemyLimit,r.baseEnemyLimit+wave*r.enemyLimitPerWave)};
}
export function adventureComplete(plan:AdventurePlan|null,ticks:number):boolean{
 return plan?.settings.mode==='timed'&&ticks>=plan.settings.durationSeconds*20;
}
export function adventureReward(plan:AdventurePlan,kills:number,ticks:number){
 const r=plan.rules,blocks=Math.floor(ticks/(20*r.timeBlockSeconds)),complete=adventureComplete(plan,ticks);
 return {mora:blocks*r.moraPerTimeBlock+kills*r.moraPerKill+(complete?r.completionMora:0),
  primogems:blocks*r.primogemsPerTimeBlock+Math.floor(kills/r.killBlock)*r.primogemsPerKillBlock+(complete?r.completionPrimogems:0)};
}
