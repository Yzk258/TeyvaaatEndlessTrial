export type BattleMap=
 | {readonly layout:'endless';readonly title:string;readonly includeRuins:boolean}
 | {readonly layout:'arena';readonly title:string;readonly includeRuins:boolean;readonly seed:number};

export const endlessMaps={
 forest:{layout:'endless',title:'低语森林',includeRuins:true}
} as const satisfies Record<string,Extract<BattleMap,{layout:'endless'}>>;
export type EndlessMapId=keyof typeof endlessMaps;
export const defaultEndlessMapId:EndlessMapId='forest';

export const arenaMaps={
 forest:{layout:'arena',title:'低语森林',includeRuins:false,seed:17},
 valley:{layout:'arena',title:'风起山谷',includeRuins:false,seed:12345},
 ruins:{layout:'arena',title:'遗迹边境',includeRuins:true,seed:20261108}
} as const satisfies Record<string,Extract<BattleMap,{layout:'arena'}>>;
