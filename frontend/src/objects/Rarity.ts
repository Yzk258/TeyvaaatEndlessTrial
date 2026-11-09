export type Rarity=3|4|5;
export function isRarity(value:number):value is Rarity{return value===3||value===4||value===5;}
