import type {arenaMaps} from './BattleMap';
import type {AdventureDifficultyId} from './AdventureSettings';
import type {TrialReward} from './TrialReward';
import {elementalCrystal,type CrystalRarity} from './ElementalCrystal';
import {elements} from './Element';

export const stageCategories=[
 {id:'mora',label:'摩拉关卡',description:'用于角色与武器培养的摩拉。'},
 {id:'primogems',label:'原石关卡',description:'可在祈愿时兑换纠缠之缘的原石。'},
 {id:'crystals',label:'元素晶石关卡',description:'选择要获取的元素。通关难度越高，奖励的晶石稀有度越高。'}
] as const;

export type StageCategoryId=(typeof stageCategories)[number]['id'];
export type Stage={
 readonly id:string;
 readonly category:StageCategoryId;
 readonly mapId:keyof typeof arenaMaps;
 readonly difficulty:AdventureDifficultyId;
 readonly enemies:number;
 readonly rewards:readonly TrialReward[];
};

const currencyStages:readonly Stage[]=[
 {id:'forest',category:'mora',mapId:'forest',difficulty:'level20',enemies:15,rewards:[{kind:'currency',currency:'mora',amount:300}]},
 {id:'valley',category:'mora',mapId:'valley',difficulty:'level40',enemies:30,rewards:[{kind:'currency',currency:'mora',amount:600}]},
 {id:'ruins',category:'mora',mapId:'ruins',difficulty:'level60',enemies:50,rewards:[{kind:'currency',currency:'mora',amount:1000}]},
 {id:'mora-level80',category:'mora',mapId:'valley',difficulty:'level80',enemies:60,rewards:[{kind:'currency',currency:'mora',amount:1800}]},
 {id:'mora-level100',category:'mora',mapId:'ruins',difficulty:'level100',enemies:75,rewards:[{kind:'currency',currency:'mora',amount:3000}]},
 {id:'forest-primogems',category:'primogems',mapId:'forest',difficulty:'level20',enemies:15,rewards:[{kind:'currency',currency:'primogems',amount:40}]},
 {id:'valley-primogems',category:'primogems',mapId:'valley',difficulty:'level40',enemies:30,rewards:[{kind:'currency',currency:'primogems',amount:80}]},
 {id:'ruins-primogems',category:'primogems',mapId:'ruins',difficulty:'level60',enemies:50,rewards:[{kind:'currency',currency:'primogems',amount:120}]},
 {id:'primogems-level80',category:'primogems',mapId:'valley',difficulty:'level80',enemies:60,rewards:[{kind:'currency',currency:'primogems',amount:180}]},
 {id:'primogems-level100',category:'primogems',mapId:'ruins',difficulty:'level100',enemies:75,rewards:[{kind:'currency',currency:'primogems',amount:260}]}
];

const crystalRaritiesByDifficulty={
 level20:1,level40:2,level60:3,level80:4,level100:5
} as const satisfies Record<AdventureDifficultyId,CrystalRarity>;
const crystalStages=elements.flatMap(element=>currencyStages.filter(stage=>stage.category==='mora').map((stage):Stage=>({
 ...stage,
 id:'crystal-'+element+'-'+stage.difficulty,
 category:'crystals',
 rewards:[{kind:'elementalCrystal',crystal:elementalCrystal(element,crystalRaritiesByDifficulty[stage.difficulty]),amount:1}]
})));
export const stages:readonly Stage[]=[...currencyStages,...crystalStages];
