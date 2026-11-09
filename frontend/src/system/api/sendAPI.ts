import {APIError} from './APIError';
export function apiName(name:string):string { return name.replace(/Message$/, '').toLowerCase(); }
export function sendAPI<T>(name:string,fields:object):Promise<T> {
 return fetch('/api/'+apiName(name),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,userToken:localStorage.getItem('teyvat-token')??''})}).then(async response=>{
 const data=await response.json();if(!response.ok)throw new APIError(response.status,data.error??'服务暂不可用');return data as T;
 });
}
