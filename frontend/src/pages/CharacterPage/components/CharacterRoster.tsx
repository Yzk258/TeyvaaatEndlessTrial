import {characters} from '../../../objects/Character';
import {SelectedCharacter} from './SelectedCharacter';
import {CharacterEnhancement} from './CharacterEnhancement';
import {CharacterCollection,type CharacterCollectionProps} from './CharacterCollection';
export type CharacterRosterProps=CharacterCollectionProps&{onLevel:()=>void};
export function CharacterRoster({onLevel,...collection}:CharacterRosterProps){
 const character=characters.find(c=>c.id===collection.selected)??characters[0];
 const owned=collection.profile.characters.find(c=>c.id===character.id);
 return <div className="space-y-8">
  <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]"><SelectedCharacter character={character} level={owned?.level}/><CharacterEnhancement profile={collection.profile} character={character} onLevel={onLevel} pending={collection.pending}/></div>
  <CharacterCollection {...collection} selected={character.id}/>
 </div>;
}
