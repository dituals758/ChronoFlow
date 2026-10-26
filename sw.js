var APP_VERSION='2026.10.26',CACHE='cf-v'+APP_VERSION,STATIC='cf-static-v'+APP_VERSION,OFFLINE='./offline.html';
var ASSETS=['./','./index.html','./styles.css','./static.css','./app.js','./clock.js','./clock.css','./version.js','./manifest.json','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./privacy.html','./terms.html','./about.html','./offline.html','./changelog.json'];
function put(c,req,res){return caches.open(c).then(function(x){return x.put(req,res)})}
self.addEventListener('install',function(e){e.waitUntil(caches.open(STATIC).then(function(c){return Promise.all(ASSETS.map(function(u){return c.add(u).catch(function(){})}))}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x.indexOf('cf-')===0&&x!==STATIC&&x!==CACHE}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('message',function(e){if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',function(e){
if(e.request.method!=='GET')return;
var u=new URL(e.request.url);
if(e.request.mode==='navigate'){
e.respondWith(caches.match('./index.html').then(function(cached){
var net=fetch(e.request).then(function(r){if(r&&r.ok)e.waitUntil(put(CACHE,e.request,r.clone()));return r}).catch(function(){return caches.match(OFFLINE)});
return cached||net;
}));
return;
}
if(u.pathname.endsWith('changelog.json')){e.respondWith(fetch(e.request).then(function(r){if(r&&r.ok)e.waitUntil(put(CACHE,e.request,r.clone()));return r}).catch(function(){return caches.match(e.request).then(function(c){return c||caches.match(OFFLINE)})}));return}
if(u.origin===self.location.origin&&/\.(js|css|png|svg|json|html|woff2?)$/.test(u.pathname)){
e.respondWith(caches.match(e.request).then(function(cached){
var net=fetch(e.request).then(function(r){if(r&&r.ok)e.waitUntil(put(STATIC,e.request,r.clone()));return r}).catch(function(){return cached});
return cached||net;
}));
return;
}
e.respondWith(fetch(e.request).then(function(r){if(r&&r.ok)e.waitUntil(put(CACHE,e.request,r.clone()));return r}).catch(function(){return caches.match(e.request).then(function(c){return c||caches.match(OFFLINE)})}));
});