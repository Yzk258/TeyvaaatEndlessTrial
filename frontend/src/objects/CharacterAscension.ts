import type {CrystalRarity} from './ElementalCrystal';

export const characterAscensions=[
 {level:20,rarity:1,amount:1},
 {level:40,rarity:2,amount:1},
 {level:50,rarity:3,amount:1},
 {level:60,rarity:4,amount:1},
 {level:70,rarity:5,amount:1},
 {level:80,rarity:5,amount:3}
] as const satisfies readonly {level:number;rarity:CrystalRarity;amount:number}[];

export function characterLevelLimit(maxLevel:number,ascension:number):number{
 return Math.min(maxLevel,characterAscensions[ascension]?.level??maxLevel);
}
