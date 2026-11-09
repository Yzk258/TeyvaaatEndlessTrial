import {sendAPI} from '../../system/api/sendAPI';
import type {Profile} from '../../objects/Profile';
export class ExchangeFatesMessage {constructor(readonly count:number,readonly requestId:string){} send():Promise<Profile>{return sendAPI<Profile>(this.constructor.name,{count:this.count,requestId:this.requestId});}}
