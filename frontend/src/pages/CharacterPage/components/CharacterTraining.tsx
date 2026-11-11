import {DevelopmentTabs} from '../../../components/ui/DevelopmentTabs';
import type {Character} from '../../../objects/Character';
import type {Profile} from '../../../objects/Profile';
import {CharacterEnhancement} from './CharacterEnhancement';
import {CharacterWeapons} from './CharacterWeapons';

export function CharacterTraining({profile,character,onLevel,onEquipWeapon,pending}:{
 profile:Profile;character:Character;onLevel:()=>void;onEquipWeapon:(weaponInstanceId:string|null)=>void;pending:boolean;
}){
 return <DevelopmentTabs label="角色培养栏目" tutorialTarget="character-enhancement" tabs={[
  {id:'enhancement',label:'强化',content:<CharacterEnhancement profile={profile} character={character} onLevel={onLevel} pending={pending}/>},
  {id:'weapons',label:'武器',content:<CharacterWeapons profile={profile} character={character} onEquipWeapon={onEquipWeapon} pending={pending}/>},
  {id:'constellations',label:'命座',inDevelopment:true},
  {id:'skills',label:'技能',inDevelopment:true},
  {id:'artifacts',label:'圣遗物',inDevelopment:true}
 ]}/>;
}
