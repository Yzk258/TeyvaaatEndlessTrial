import type {arenaMaps} from './BattleMap';
import type {TrialReward} from './TrialReward';

export const stageCategories=[
 {id:'mora',label:'摩拉关卡',description:'用于角色与武器培养的摩拉。'},
 {id:'primogems',label:'原石关卡',description:'可在祈愿时兑换纠缠之缘的原石。'}
] as const;

export type StageCategoryId=(typeof stageCategories)[number]['id'];
export type Stage={
 readonly id:string;
 readonly category:StageCategoryId;
 readonly mapId:keyof typeof arenaMaps;
 readonly difficulty:string;
 readonly enemies:number;
 readonly rewards:readonly TrialReward[];
};

export const stages:readonly Stage[]=[
 {id:'forest',category:'mora',mapId:'forest',difficulty:'简单',enemies:15,rewards:[{kind:'currency',currency:'mora',amount:300}]},
 {id:'valley',category:'mora',mapId:'valley',difficulty:'普通',enemies:30,rewards:[{kind:'currency',currency:'mora',amount:600}]},
 {id:'ruins',category:'mora',mapId:'ruins',difficulty:'困难',enemies:50,rewards:[{kind:'currency',currency:'mora',amount:1000}]},
 {id:'forest-primogems',category:'primogems',mapId:'forest',difficulty:'简单',enemies:15,rewards:[{kind:'currency',currency:'primogems',amount:40}]},
 {id:'valley-primogems',category:'primogems',mapId:'valley',difficulty:'普通',enemies:30,rewards:[{kind:'currency',currency:'primogems',amount:80}]},
 {id:'ruins-primogems',category:'primogems',mapId:'ruins',difficulty:'困难',enemies:50,rewards:[{kind:'currency',currency:'primogems',amount:120}]}
];
