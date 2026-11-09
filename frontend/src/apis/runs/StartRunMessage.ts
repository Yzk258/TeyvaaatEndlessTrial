import {sendAPI} from '../../system/api/sendAPI';
import type {RunStart} from '../../objects/Profile';
import type {AdventureSettings} from '../../objects/AdventureSettings';
import type {CharacterId} from '../../objects/Character';
export class StartRunMessage {constructor(readonly characterId:CharacterId,readonly requestId:string,readonly stageId:string|null=null,readonly adventure:AdventureSettings|null=null){} send():Promise<RunStart>{return sendAPI<RunStart>(this.constructor.name,{characterId:this.characterId,requestId:this.requestId,stageId:this.stageId,adventure:this.adventure});}}
