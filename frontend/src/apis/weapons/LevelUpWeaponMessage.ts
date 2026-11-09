import {sendAPI} from '../../system/api/sendAPI';
import type {Profile} from '../../objects/Profile';
import type {Weapon,WeaponWishResult} from '../../objects/Weapon';
export class LevelUpWeaponMessage {constructor(readonly weaponId:string,readonly requestId:string){}send():Promise<Profile>{return sendAPI(this.constructor.name,{weaponId:this.weaponId,requestId:this.requestId});}}
