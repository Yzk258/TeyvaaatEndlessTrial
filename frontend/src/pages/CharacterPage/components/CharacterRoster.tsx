import {characters,type CharacterId} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {SelectedCharacter} from './SelectedCharacter';
import {CharacterEnhancement} from './CharacterEnhancement';
import {CharacterCollection} from './CharacterCollection';
export function CharacterRoster({profile,selected,onSelect,onLevel,pending}:{profile:Profile;selected:CharacterId;onSelect:(id:CharacterId)=>void;onLevel:()=>void;pending:boolean}){
 const character=characters.find(c=>c.id===selected)??characters[0];
 const owned=profile.characters.find(c=>c.id===character.id);
 return <div className="space-y-8">
  <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]"><SelectedCharacter character={character} level={owned?.level}/><CharacterEnhancement profile={profile} character={character} onLevel={onLevel} pending={pending}/></div>
  <CharacterCollection profile={profile} selected={character.id} onSelect={onSelect}/>
 </div>;
}
