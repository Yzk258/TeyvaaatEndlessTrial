import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class SetUserRoleMessage {constructor(readonly targetId:string,readonly role:UserRole){}send():Promise<readonly AccountSummary[]>{return sendAPI(this.constructor.name,{targetId:this.targetId,role:this.role});}}
