import type {OwnedWeapon,Equipment,WeaponLoadout} from './Weapon';
import type {Character} from './Character';
import type {Stage} from './Stage';
import type { CharacterId } from './Character';
import type {WishPull} from './WishReward';
import type {AdventurePlan} from './AdventurePlan';
import type {BattleMap} from './BattleMap';
export type Profile = { readonly primogems:number; readonly mora:number; readonly intertwinedFates:number; readonly characters:readonly { readonly id:CharacterId; readonly level:number; readonly copies:number }[]; readonly pity:number; readonly runs:number;readonly weapons:readonly OwnedWeapon[];readonly equipment:readonly Equipment[];readonly weaponPity:number;readonly fourStarPity:number;readonly weaponFourStarPity:number };
export type WishResult = WishPull&{readonly profile:Profile};
export type RunStart = {
 readonly runId:string;readonly seed:number;readonly level:number;readonly character:Character;readonly equippedWeapon:WeaponLoadout|null;
}&(
 | {readonly stage:Stage;readonly adventure:null;readonly map:Extract<BattleMap,{layout:'arena'}>}
 | {readonly stage:null;readonly adventure:AdventurePlan;readonly map:Extract<BattleMap,{layout:'endless'}>}
);
