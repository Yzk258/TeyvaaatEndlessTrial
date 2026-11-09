import {sendAPI} from '../../system/api/sendAPI';
import type {Profile} from '../../objects/Profile';
import type {Weapon,WeaponWishResult} from '../../objects/Weapon';
export class EquipWeaponMessage {constructor(readonly characterId:string,readonly weaponId:string|null){}send():Promise<Profile>{return sendAPI(this.constructor.name,{characterId:this.characterId,weaponId:this.weaponId});}}
