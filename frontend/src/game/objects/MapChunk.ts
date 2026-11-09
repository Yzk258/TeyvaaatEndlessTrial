import type {MapTile,RuinTileKind} from './MapTile';
export type MapDecoration={readonly kind:'water'|'grass'|'flower'|'rock'|'tree'|'bigtree'|'bush'|'crag'|'ruin'|'windmill'|'camp'|'pond'|'waypoint'|'tower'|'statue'|'lantern'|'signpost'|'crate'|'barrel'|'campfire'|'dandelion'|'ore'|'slabs'|Exclude<RuinTileKind,'ruinFloor'>;readonly x:number;readonly y:number;readonly variant:number};
export type MapChunk={readonly x:number;readonly y:number;readonly tint:number;readonly tiles:readonly MapTile[];readonly decorations:readonly MapDecoration[]};
