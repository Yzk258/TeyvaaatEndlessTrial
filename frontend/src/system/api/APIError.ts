export class APIError extends Error {
 constructor(readonly status:number,message:string){super(message);this.name='APIError';}
}
