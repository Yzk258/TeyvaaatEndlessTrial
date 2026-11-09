import type {Character} from '../../objects/Character';
export function characterStats(character:Character,level:number){return {attack:character.baseAttack+(level-1)*character.attackGrowth,maxHp:character.baseHp+(level-1)*character.hpGrowth};}
