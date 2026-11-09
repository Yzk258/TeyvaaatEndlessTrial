import {sendAPI} from '../../system/api/sendAPI';
import type {Profile,WishResult,RunStart} from '../../objects/Profile';
import type {CharacterId} from '../../objects/Character';
export class PerformWishMessage {constructor(readonly requestId:string){} send():Promise<WishResult>{return sendAPI<WishResult>(this.constructor.name,{requestId:this.requestId});}}
