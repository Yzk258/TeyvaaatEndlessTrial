import {sendAPI} from '../../system/api/sendAPI';
import type {Profile,WishResult,RunStart} from '../../objects/Profile';
import type {CharacterId} from '../../objects/Character';
export class GetProfileMessage {constructor(){} send():Promise<Profile>{return sendAPI<Profile>(this.constructor.name,{});}}
