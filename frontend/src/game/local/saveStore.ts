import {readSaveData,type LocalSave} from './LocalSave';

const storeName='saves';
let opening:Promise<IDBDatabase>|undefined;

function database():Promise<IDBDatabase>{
 opening??=new Promise<IDBDatabase>((resolve,reject)=>{
  const request=indexedDB.open('teyvat-single-player',1);
  request.onupgradeneeded=()=>request.result.createObjectStore(storeName,{keyPath:'id'});
  request.onerror=()=>reject(new Error('无法打开本地存档，请检查浏览器的存储权限'));
  request.onsuccess=()=>{
   const db=request.result;
   db.onversionchange=()=>{db.close();opening=undefined;};
   resolve(db);
  };
 }).catch(error=>{opening=undefined;throw error;});
 return opening;
}

async function transaction<T>(mode:IDBTransactionMode,work:(store:IDBObjectStore,finish:(value:T)=>void,fail:(error:unknown)=>void)=>void):Promise<T>{
 const db=await database();
 return new Promise<T>((resolve,reject)=>{
  const tx=db.transaction(storeName,mode);
  let result:T;
  let failure:unknown;
  tx.oncomplete=()=>resolve(result);
  tx.onabort=()=>reject(failure??new Error('存档操作失败，请检查浏览器可用空间'));
  const fail=(error:unknown)=>{failure=error;tx.abort();};
  try{work(tx.objectStore(storeName),value=>{result=value;},fail);}
  catch(error){fail(error);}
 });
}

export function listSaves():Promise<readonly LocalSave[]>{
 return transaction('readonly',(store,finish,fail)=>{
  const request=store.getAll();
  request.onsuccess=()=>{
   try{finish(request.result.map(readSaveData).sort((a,b)=>b.updatedAt-a.updatedAt));}
   catch(error){fail(error);}
  };
 });
}

export function loadSave(id:string):Promise<LocalSave>{
 return transaction('readonly',(store,finish,fail)=>{
  const request=store.get(id);
  request.onsuccess=()=>{
   try{
    if(!request.result)throw new Error('找不到这份存档');
    finish(readSaveData(request.result));
   }catch(error){fail(error);}
  };
 });
}

export function addSave(save:LocalSave):Promise<LocalSave>{
 return transaction('readwrite',(store,finish)=>{
  store.add(save);
  finish(save);
 });
}

export function updateSave(id:string,change:(save:LocalSave)=>LocalSave):Promise<LocalSave>{
 return transaction('readwrite',(store,finish,fail)=>{
  const request=store.get(id);
  request.onsuccess=()=>{
   try{
    if(!request.result)throw new Error('找不到这份存档');
    const current=readSaveData(request.result);
    const changed=change(current);
    const next=changed===current?current:{...changed,updatedAt:Date.now()};
    if(changed!==current)store.put(next);
    finish(next);
   }catch(error){fail(error);}
  };
 });
}

export async function importSave(file:File):Promise<LocalSave>{
 if(file.size>4*1024*1024)throw new Error('存档文件不能超过 4 MB');
 let value:unknown;
 try{value=JSON.parse(await file.text());}
 catch{throw new Error('请选择有效的提瓦特 JSON 存档');}
 const saved=readSaveData(value);
 return addSave({...saved,id:crypto.randomUUID(),updatedAt:Date.now()});
}

export function downloadSave(save:LocalSave){
 const url=URL.createObjectURL(new Blob([JSON.stringify(save,null,2)],{type:'application/json'}));
 const link=document.createElement('a');
 link.href=url;
 link.download='teyvat-save-'+save.id+'.json';
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
