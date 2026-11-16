import {elementLabels,elements,type Element} from './Element';

export const crystalRarities={
 1:{label:'白',name:'晶屑',color:'#e7e5e4'},
 2:{label:'绿',name:'碎晶',color:'#86efac'},
 3:{label:'蓝',name:'晶块',color:'#93c5fd'},
 4:{label:'紫',name:'晶簇',color:'#c4b5fd'},
 5:{label:'金',name:'晶核',color:'#fcd34d'}
} as const;
const rarities=[1,2,3,4,5] as const;
export type CrystalRarity=(typeof rarities)[number];
export type ElementalCrystalId=`${Element}-${CrystalRarity}`;
export type CrystalInventory=Readonly<Partial<Record<ElementalCrystalId,number>>>;
export type ElementalCrystal={readonly id:ElementalCrystalId;readonly element:Element;readonly rarity:CrystalRarity;readonly name:string};

export function elementalCrystal(element:Element,rarity:CrystalRarity):ElementalCrystal{
 const id:ElementalCrystalId=`${element}-${rarity}`;
 return {id,element,rarity,name:elementLabels[element]+'元素'+crystalRarities[rarity].name};
}

export const elementalCrystals=elements.flatMap(element=>rarities.map(rarity=>elementalCrystal(element,rarity)));
