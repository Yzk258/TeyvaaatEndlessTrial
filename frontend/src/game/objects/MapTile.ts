export type RuinTileKind='ruinFloor'|'ruinArch'|'ruinWall'|'ruinPillar';
export type MapTileKind='meadow'|'sand'|'water'|'tallGrass'|'tree'|'rock'|'rockCluster'|'waypoint'|RuinTileKind;
export type MapTile={readonly x:number;readonly y:number;readonly kind:MapTileKind;readonly variant:number;readonly shade:number;readonly shore:number};
