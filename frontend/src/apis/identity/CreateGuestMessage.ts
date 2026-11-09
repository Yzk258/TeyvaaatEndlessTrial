import {sendAPI} from '../../system/api/sendAPI';
import type {Profile,WishResult,RunStart} from '../../objects/Profile';
import type {CharacterId} from '../../objects/Character';
export class CreateGuestMessage {constructor(readonly nickname:string){} send():Promise<{token:string}>{return sendAPI<{token:string}>(this.constructor.name,{nickname:this.nickname});}}
