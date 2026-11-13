import type {WeaponStat} from './Weapon';

export const artifactSlots={flower:'生之花',plume:'死之羽',sands:'时之沙',goblet:'空之杯',circlet:'理之冠'} as const;
export type ArtifactSlot=keyof typeof artifactSlots;
export const artifactSlotIds=Object.keys(artifactSlots) as ArtifactSlot[];

export const artifactRarities={
 1:{label:'白',maxLevel:4,color:'#e7e5e4'},2:{label:'绿',maxLevel:8,color:'#86efac'},
 3:{label:'蓝',maxLevel:12,color:'#93c5fd'},4:{label:'紫',maxLevel:16,color:'#c4b5fd'},
 5:{label:'金',maxLevel:20,color:'#fcd34d'}
} as const;
export type ArtifactRarity=keyof typeof artifactRarities;

type SetBonus={readonly pieces:2|4}&(
 | {readonly kind:'attackPercent';readonly value:number}
 | {readonly kind:'healOnKillPercent';readonly value:number}
);
export const artifactSets={
 beginner:{name:'初学者',bonuses:[{pieces:2,kind:'attackPercent',value:15},{pieces:4,kind:'healOnKillPercent',value:3}]}
} as const satisfies Record<string,{readonly name:string;readonly bonuses:readonly SetBonus[]}>;
export type ArtifactSetId=keyof typeof artifactSets;
export type ArtifactDefinition={
 readonly id:string;readonly name:string;readonly slot:ArtifactSlot;readonly setId:ArtifactSetId;
 readonly rarity:ArtifactRarity;readonly mainStat:WeaponStat;readonly levelUpCost:number;
};

export const artifacts:readonly ArtifactDefinition[]=[
 {id:'beginner-flower',name:'初学者的野花',slot:'flower',setId:'beginner',rarity:1,mainStat:{kind:'hpFlat',base:10,growth:3},levelUpCost:200},
 {id:'beginner-plume',name:'初学者的雀羽',slot:'plume',setId:'beginner',rarity:1,mainStat:{kind:'attackFlat',base:1,growth:.25},levelUpCost:200},
 {id:'beginner-sands',name:'初学者的沙漏',slot:'sands',setId:'beginner',rarity:1,mainStat:{kind:'attackPercent',base:4,growth:1},levelUpCost:200},
 {id:'beginner-goblet',name:'初学者的陶杯',slot:'goblet',setId:'beginner',rarity:1,mainStat:{kind:'attackRangeFlat',base:4,growth:1},levelUpCost:200},
 {id:'beginner-circlet',name:'初学者的叶冠',slot:'circlet',setId:'beginner',rarity:1,mainStat:{kind:'hpPercent',base:4,growth:1},levelUpCost:200}
];
export const beginnerArtifacts=artifacts.filter(item=>item.setId==='beginner');

export type OwnedArtifact={readonly id:string;readonly artifactId:string;readonly level:number};
export type ArtifactEquipment={readonly characterId:string;readonly artifactInstanceId:string};
export type ArtifactLoadout={readonly definition:ArtifactDefinition;readonly level:number};
