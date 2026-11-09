import type {Element} from './Element';

export const regionLabels={
 mondstadt:'蒙德',
 liyue:'璃月',
 inazuma:'稻妻',
 sumeru:'须弥',
 fontaine:'枫丹',
 natlan:'纳塔',
 snezhnaya:'至冬',
 'nod-krai':'挪德卡莱',
 other:'其他地区',
} as const;
type CharacterRegion=keyof typeof regionLabels;
export type CharacterFilter={
 readonly region:CharacterRegion|'all';
 readonly element:Element|'all';
};
export const allCharacterFilters:CharacterFilter={region:'all',element:'all'};
export const characterPageSize=12;

const regionGroups:Readonly<Record<CharacterRegion,readonly string[]>>={
 mondstadt:['amber','barbara','lisa','kaeya','bennett','diluc','diona','klee','mona','jean','venti','sucrose'],
 liyue:['hu-tao','keqing','ningguang','qiqi','xiangling','xingqiu','zhongli','shenhe','xianyun','xiao','yelan'],
 inazuma:['yae-miko','kujou-sara','raiden-shogun','yumemizuki-mizuki','kamisato-ayaka','yoimiya'],
 sumeru:['nahida','faruzan','nilou'],
 fontaine:['escoffier','clorinde','neuvillette','navia','arlecchino','chiori','furina'],
 natlan:['mavuika','citlali'],
 snezhnaya:['odette','sandrone','vesna','danika','tsaritsa'],
 'nod-krai':['aino','lauma','nefer','columbina'],
 other:['nicole','skirk'],
};
const regions:Readonly<Partial<Record<string,CharacterRegion>>>=Object.fromEntries(
 Object.entries(regionGroups).flatMap(([region,ids])=>ids.map(id=>[id,region as CharacterRegion]))
);
export function characterRegion(id:string):CharacterRegion{
 return regions[id]??'other';
}
export function matchesCharacterFilter(id:string,element:string|undefined,filter:CharacterFilter):boolean{
 return (filter.region==='all'||filter.region===characterRegion(id))
  &&(filter.element==='all'||filter.element===element);
}
