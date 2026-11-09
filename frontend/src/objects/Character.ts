import {isAttackPattern,type AttackPattern} from './AttackPattern';
import type {AttackVisual} from './AttackVisual';
import definitions from '../../../shared/characters.json';
import {elementLabels,type Element} from './Element';
import {weaponLabels,type WeaponType} from './WeaponType';
import {attackStyleLabels,type AttackStyle} from './AttackStyle';
import {isRarity} from './Rarity';
export type CharacterId=string;
export type Character={readonly id:CharacterId;readonly name:string;readonly title:string;readonly element:Element;readonly weapon:WeaponType;readonly attackStyle:AttackStyle;readonly color:string;readonly symbol:string;readonly baseAttack:number;readonly attackGrowth:number;readonly baseHp:number;readonly hpGrowth:number;readonly attackRange:number;readonly attackIntervalTicks:number;readonly maxLevel:number;readonly levelUpCost:number;readonly attackPattern:AttackPattern;readonly attackVisual:AttackVisual;readonly inStandardBanner:boolean;readonly rarity:4|5};
function isCharacter(value:typeof definitions[number]):value is typeof definitions[number]&Character {
 return isRarity(value.rarity)&&value.rarity!==3&&isAttackPattern(value.attackPattern)&&['arrow','orb','slash','burst'].includes(value.attackVisual.style)&&Object.hasOwn(elementLabels,value.element)&&Object.hasOwn(weaponLabels,value.weapon)&&Object.hasOwn(attackStyleLabels,value.attackStyle)&&value.id.length>0&&value.baseAttack>0&&value.baseHp>0&&value.attackGrowth>=0&&value.hpGrowth>=0&&value.attackRange>0&&Number.isInteger(value.attackIntervalTicks)&&value.attackIntervalTicks>0&&value.maxLevel>=1&&value.levelUpCost>=0;
}
if(!definitions.every(isCharacter)||new Set(definitions.map(c=>c.id)).size!==definitions.length)throw new Error('角色配置无效');
export const characters:readonly Character[]=definitions;
