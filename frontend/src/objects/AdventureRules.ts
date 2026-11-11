export type AdventureRules={
 readonly stepSeconds:number;readonly healthGrowthPercent:number;readonly damageGrowthPercent:number;
 readonly baseSpawnIntervalTicks:number;readonly minSpawnIntervalTicks:number;readonly maxSpawnCount:number;readonly spawnCountStepWaves:number;
 readonly baseEnemyLimit:number;readonly maxEnemyLimit:number;readonly enemyLimitPerWave:number;
 readonly timeBlockSeconds:number;readonly moraPerTimeBlock:number;readonly moraPerKill:number;
 readonly primogemsPerTimeBlock:number;readonly killBlock:number;readonly primogemsPerKillBlock:number;
};
