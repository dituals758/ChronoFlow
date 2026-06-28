importScripts('./version.js');

var CACHE = 'cf-v' + APP_VERSION;

var ASSETS = ['./', './index.html', './styles.css', './app.js', './version.js', './manifest.json', './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE).then(function (c) {
            return Promise.all(ASSETS.map(function (u) { return c.add(u).catch(function () {}); }));
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (k) {
            return Promise.all(
                k.filter(function (x) { return x !== CACHE; }).map(function (x) { return caches.delete(x); })
            );
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(function (cached) {
            var fetched = fetch(e.request).then(function (r) {
                if (r.ok) {
                    var c = r.clone();
                    caches.open(CACHE).then(function (cache) { cache.put(e.request, c); });
                }
                return r;
            }).catch(function () { return cached; });
            return cached || fetched;
        })
    );
});
