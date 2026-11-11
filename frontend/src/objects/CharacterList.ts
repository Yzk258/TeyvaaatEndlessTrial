import {characters,type Character,type CharacterId} from './Character';
import type {Profile} from './Profile';

export type CharacterListEntry={
 readonly definition:Character;
 readonly owned:Profile['characters'][number]|undefined;
 readonly favorite:boolean;
};

export function characterListEntries(ownedCharacters:Profile['characters'],favoriteCharacters:readonly CharacterId[]):CharacterListEntry[]{
 const ownedById=new Map(ownedCharacters.map(character=>[character.id,character]));
 const favoriteOrder=new Map(favoriteCharacters.map((id,index)=>[id,index]));
 const entries=characters.map(definition=>{
  const owned=ownedById.get(definition.id);
  return {definition,owned,favorite:!!owned&&favoriteOrder.has(definition.id)};
 });
 const ownedRank=favoriteCharacters.length;
 const rank=(entry:CharacterListEntry)=>entry.owned?(favoriteOrder.get(entry.definition.id)??ownedRank):ownedRank+1;
 return entries.sort((first,second)=>rank(first)-rank(second));
}
