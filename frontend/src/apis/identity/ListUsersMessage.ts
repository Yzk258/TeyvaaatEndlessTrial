import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class ListUsersMessage {constructor(){}send():Promise<readonly AccountSummary[]>{return sendAPI(this.constructor.name,{});}}
