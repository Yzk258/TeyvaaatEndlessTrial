import {useState} from 'react';
import {characters} from '../../../objects/Character';
import {characterListEntries} from '../../../objects/CharacterList';
import {weapons} from '../../../objects/Weapon';
import {groupOwnedWeapons,weaponDefinitionsByOwnership} from '../../../game/functions/weaponInventory';
import {elementLabels} from '../../../objects/Element';
import {allCharacterFilters,characterPageSize,characterRegion,matchesCharacterFilter,regionLabels,type CharacterFilter} from '../../../objects/CharacterFilter';
import {weaponLabels} from '../../../objects/WeaponType';
import type {Profile} from '../../../objects/Profile';
import type {ArchiveFilter} from '../objects/ArchiveFilter';
import referenceFiles from '../../../../../shared/character-references.json';
const references:Readonly<Record<string,{readonly name:string;readonly archiveOnly?:boolean;readonly element?:string}>>=referenceFiles;
const referenceEntries=Object.entries(references).flatMap(([id,reference])=>
 reference.archiveOnly?[{id,name:reference.name,element:reference.element}]:[]
);
export function useArchive(profile:Profile,favoriteCharacters:readonly string[]){
 const [tab,setTab]=useState<'characters'|'weapons'>('characters');
 const [search,setSearch]=useState('');
 const [filter,setFilter]=useState<ArchiveFilter>('all');
 const [characterFilter,setCharacterFilter]=useState(allCharacterFilters);
 const [index,setIndex]=useState(0);
 const query=search.trim().toLowerCase();
 const visible=(unlocked:boolean,text:string)=>(filter==='all'||(filter==='unlocked'?unlocked:!unlocked))&&text.toLowerCase().includes(query);
 const characterEntries=characterListEntries(profile.characters,favoriteCharacters);
 const weaponGroups=groupOwnedWeapons(profile.weapons);
 const weaponEntries=weaponDefinitionsByOwnership(weaponGroups).map(definition=>({definition,quantity:weaponGroups.get(definition.id)?.length??0}));
 const matches=characterEntries.filter(({definition:c,owned})=>
  matchesCharacterFilter(c.id,c.element,characterFilter)&&
  visible(!!owned,[c.name,c.title,elementLabels[c.element],weaponLabels[c.weapon],regionLabels[characterRegion(c.id)]].join(' '))
 );
 const matchedReferences=filter==='all'?referenceEntries.filter(entry=>
  matchesCharacterFilter(entry.id,entry.element,characterFilter)&&
  (entry.name+' '+regionLabels[characterRegion(entry.id)]).toLowerCase().includes(query)
 ):[];
 const matchCount=matches.length+matchedReferences.length;
 const pageCount=Math.ceil(matchCount/characterPageSize);
 const pageIndex=Math.min(index,Math.max(0,pageCount-1));
 const start=pageIndex*characterPageSize,end=start+characterPageSize;
 return {tab,setTab,search,filter,characterFilter,pageIndex,pageCount,matchCount,setIndex,
  setSearch:(next:string)=>{setSearch(next);setIndex(0);},
  setFilter:(next:ArchiveFilter)=>{setFilter(next);setIndex(0);},
  setCharacterFilter:(next:CharacterFilter)=>{setCharacterFilter(next);setIndex(0);},
  characterCount:characterEntries.filter(e=>!!e.owned).length,characterTotal:characters.length,
  weaponCount:weaponEntries.filter(e=>e.quantity>0).length,weaponTotal:weapons.length,
  characters:matches.slice(start,end),
  characterReferences:matchedReferences.slice(Math.max(0,start-matches.length),Math.max(0,end-matches.length)),
  weapons:weaponEntries.filter(e=>visible(e.quantity>0,[e.definition.name,weaponLabels[e.definition.weapon],e.definition.talent.name,e.definition.talent.description].join(' ')))
 };
}
