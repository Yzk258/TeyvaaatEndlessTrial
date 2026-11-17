import type {Stage} from '../../objects/Stage';

export const leyLineHref='#/ley-lines';
export const bossHuntHref='#/boss-hunt';

export function stageReturnHref(stage:Stage|null){
 if(!stage)return '#/camp';
 return stage.category==='crystals'?bossHuntHref:leyLineHref;
}
