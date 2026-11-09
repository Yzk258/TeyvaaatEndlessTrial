import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class LogoutMessage {constructor(){}send():Promise<void>{return sendAPI(this.constructor.name,{});}}
