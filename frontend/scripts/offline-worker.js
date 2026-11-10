const scope=self.registration.scope;
const cachePrefix='teyvat-offline:'+scope+':';
const cacheName=cachePrefix+release;
const index=new URL('index.html',scope).href;

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(cacheName);
  try{
   for(let offset=0;offset<precachePaths.length;offset+=8){
    await cache.addAll(precachePaths.slice(offset,offset+8).map(path=>new URL(path,scope).href));
   }
  }catch(error){
   await caches.delete(cacheName);
   throw error;
  }
 })());
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(cachePrefix)&&key!==cacheName).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 const {request}=event;
 if(request.method!=='GET'||!request.url.startsWith(scope))return;
 const url=new URL(request.url);
 const target=request.mode==='navigate'&&(url.pathname===new URL(scope).pathname||url.pathname===new URL(index).pathname)
  ?index:request;
 event.respondWith(caches.open(cacheName).then(cache=>cache.match(target)).then(response=>response??fetch(request)));
});
