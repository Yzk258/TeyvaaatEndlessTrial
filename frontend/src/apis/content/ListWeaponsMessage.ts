import {sendAPI} from '../../system/api/sendAPI';
import type {Profile} from '../../objects/Profile';
import type {Weapon,WeaponWishResult} from '../../objects/Weapon';
export class ListWeaponsMessage {constructor(){}send():Promise<readonly Weapon[]>{return sendAPI(this.constructor.name,{});}}
