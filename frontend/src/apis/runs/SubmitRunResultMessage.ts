import {sendAPI} from '../../system/api/sendAPI';
import type {Profile,WishResult,RunStart} from '../../objects/Profile';
import type {CharacterId} from '../../objects/Character';
export class SubmitRunResultMessage {constructor(readonly runId:string,readonly kills:number,readonly ticks:number){} send():Promise<Profile>{return sendAPI<Profile>(this.constructor.name,{runId:this.runId,kills:this.kills,ticks:this.ticks});}}
