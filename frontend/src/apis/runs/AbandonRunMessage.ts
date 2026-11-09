import {sendAPI} from '../../system/api/sendAPI';
import type {Profile} from '../../objects/Profile';
export class AbandonRunMessage {
 constructor(readonly runId:string){}
 send():Promise<Profile>{return sendAPI(this.constructor.name,{runId:this.runId});}
}
