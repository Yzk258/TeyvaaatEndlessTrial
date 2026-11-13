import {characters} from '../../../objects/Character';
import type {ArtifactSlot} from '../../../objects/Artifact';
import {SelectedCharacter} from './SelectedCharacter';
import {CharacterTraining} from './CharacterTraining';
import {CharacterCollection,type CharacterCollectionProps} from './CharacterCollection';
export type CharacterRosterProps=CharacterCollectionProps&{onLevel:()=>void;onEquipWeapon:(characterId:string,weaponInstanceId:string|null)=>void;onEquipArtifact:(characterId:string,slot:ArtifactSlot,id:string|null)=>void};
export function CharacterRoster({onLevel,onEquipWeapon,onEquipArtifact,...collection}:CharacterRosterProps){
 const character=characters.find(c=>c.id===collection.selected)??characters[0];
 const owned=collection.profile.characters.find(c=>c.id===character.id);
 return <div className="space-y-8">
  <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]">
   <SelectedCharacter character={character} level={owned?.level}/>
   <CharacterTraining profile={collection.profile} character={character} onLevel={onLevel}
    onEquipWeapon={weaponInstanceId=>onEquipWeapon(character.id,weaponInstanceId)}
    onEquipArtifact={(slot,id)=>onEquipArtifact(character.id,slot,id)} pending={collection.pending}/>
  </div>
  <CharacterCollection {...collection} selected={character.id}/>
 </div>;
}
