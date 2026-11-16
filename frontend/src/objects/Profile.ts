import type {OwnedWeapon,Equipment,WeaponLoadout} from './Weapon';
import type {Character,CharacterId} from './Character';
import type {Stage} from './Stage';
import type {WishPull} from './WishReward';
import type {AdventurePlan} from './AdventurePlan';
import type {AdventureDifficulty} from './AdventureSettings';
import type {BattleMap} from './BattleMap';
import type {ArtifactEquipment,ArtifactLoadout,OwnedArtifact} from './Artifact';
import type {CrystalInventory} from './ElementalCrystal';
export type OwnedCharacter={readonly id:CharacterId;readonly level:number;readonly copies:number;readonly ascension:number};
export type Profile = { readonly primogems:number; readonly mora:number; readonly intertwinedFates:number; readonly characters:readonly OwnedCharacter[]; readonly pity:number; readonly runs:number;readonly weapons:readonly OwnedWeapon[];readonly equipment:readonly Equipment[];readonly weaponPity:number;readonly fourStarPity:number;readonly weaponFourStarPity:number;readonly artifacts:readonly OwnedArtifact[];readonly artifactEquipment:readonly ArtifactEquipment[];readonly crystals:CrystalInventory;
 readonly nextWeaponSerial?:number;
 readonly dismantledEquipment?:{readonly weapon:readonly string[];readonly artifact:readonly string[]};
};
export type WishResult = WishPull&{readonly profile:Profile};
export type RunStart = {
 readonly runId:string;readonly seed:number;readonly level:number;readonly character:Character;readonly equippedWeapon:WeaponLoadout|null;readonly equippedArtifacts:readonly ArtifactLoadout[];
}&(
 | {readonly stage:Stage;readonly stageDifficulty:AdventureDifficulty;readonly adventure:null;readonly map:Extract<BattleMap,{layout:'arena'}>}
 | {readonly stage:null;readonly adventure:AdventurePlan;readonly map:Extract<BattleMap,{layout:'endless'}>}
);
