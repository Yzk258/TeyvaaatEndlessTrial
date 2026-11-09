import {sendAPI} from '../../system/api/sendAPI';
import type {Character} from '../../objects/Character';
export class ListCharactersMessage {send():Promise<readonly Character[]>{return sendAPI(this.constructor.name,{});}}
