import {sendAPI} from '../../system/api/sendAPI';
import type {AuthSession,LoginResponse,CurrentUser,AccountSummary,UserRole} from '../../objects/CurrentUser';
export class BindAccountMessage {constructor(readonly username:string,readonly password:string,readonly nickname:string){}send():Promise<AuthSession>{return sendAPI(this.constructor.name,{username:this.username,password:this.password,nickname:this.nickname});}}
