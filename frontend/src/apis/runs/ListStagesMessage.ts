import {sendAPI} from '../../system/api/sendAPI';
import type {Stage} from '../../objects/Stage';
export class ListStagesMessage {send():Promise<readonly Stage[]>{return sendAPI(this.constructor.name,{});}}
