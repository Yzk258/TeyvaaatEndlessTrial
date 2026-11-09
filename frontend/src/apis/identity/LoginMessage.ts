import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class LoginMessage {constructor(readonly username:string,readonly password:string){}send():Promise<LoginResponse>{return sendAPI(this.constructor.name,{username:this.username,password:this.password});}}
