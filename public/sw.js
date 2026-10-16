const VERSION='letras-v1.4-gp-test';
const CACHE_NAME='trucker-cap-letras-'+VERSION;
const CORE=['./index.html','./compat.js','./app.css','./core.js','./pedal.js','./local-library.js','./guitar-pro.js','./vendor/alphatab/alphaTab.min.mjs','./vendor/alphatab/alphaTab.core.mjs','./vendor/alphatab/font/Bravura.woff2','./app.js','./offline.js','./vendor/pdf.min.mjs','./vendor/pdf.worker.min.mjs'];
const OPTIONAL=['./manifest.json','./icon-192.png','./icon-512.png'];
const url=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE_NAME);
 await Promise.all(CORE.map(async path=>{const response=await fetch(new Request(url(path),{cache:'reload'}));if(!response.ok)throw Error('Recurso indisponível: '+path);const type=response.headers.get('content-type')||'';if(/\.(m?js|css)$/.test(path)&&/text\/html/i.test(type))throw Error('Recurso inválido: '+path);await cache.put(url(path),response)}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE_NAME);const complete=await Promise.all(CORE.map(path=>cache.match(url(path))));if(!complete.every(Boolean))throw Error('Cache incompleto');
 await self.clients.claim();
 await Promise.all((await caches.keys()).filter(key=>key.startsWith('trucker-cap-letras-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));
 await Promise.allSettled(OPTIONAL.map(async path=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);try{const response=await fetch(url(path),{signal:controller.signal});if(response.ok)await cache.put(url(path),response)}catch{}finally{clearTimeout(timer)}}));
})()));
self.addEventListener('message',event=>{if(event.data?.type!=='OFFLINE_STATUS'||!event.ports[0])return;event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);const entries=await Promise.all(CORE.map(path=>cache.match(url(path))));event.ports[0].postMessage({ready:entries.every(Boolean),version:VERSION})})())});
self.addEventListener('fetch',event=>{
 const request=event.request,parsed=new URL(request.url);if(request.method!=='GET'||parsed.origin!==self.location.origin||!parsed.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);if(request.mode==='navigate')return (await cache.match(url('./index.html')))||fetch(request);const cached=await cache.match(request,{ignoreSearch:true});return cached||fetch(request)})());
});
