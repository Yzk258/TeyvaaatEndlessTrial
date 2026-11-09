import {sendAPI} from '../../system/api/sendAPI';
import type {Profile,WishResult,RunStart} from '../../objects/Profile';
import type {CharacterId} from '../../objects/Character';
export class LevelUpCharacterMessage {constructor(readonly characterId:CharacterId,readonly requestId:string){} send():Promise<Profile>{return sendAPI<Profile>(this.constructor.name,{characterId:this.characterId,requestId:this.requestId});}}
