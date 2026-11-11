import rules from '../../../shared/adventure-rules.json';
import type {EndlessMapId} from './BattleMap';

export const adventureDifficulties=rules.difficulties;
export type AdventureDifficultyId=keyof typeof adventureDifficulties;
export type AdventureDifficulty=Readonly<(typeof adventureDifficulties)[AdventureDifficultyId]>;
export type AdventureSettings={readonly difficulty:AdventureDifficultyId;readonly mapId?:EndlessMapId};
