import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class GetCurrentUserMessage {constructor(){}send():Promise<CurrentUser>{return sendAPI(this.constructor.name,{});}}
