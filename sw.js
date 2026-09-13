importScripts('./version.js');

var CACHE = 'cf-v' + APP_VERSION;
var STATIC_CACHE = 'cf-static-v' + APP_VERSION;
var OFFLINE_URL = './offline.html';

var ASSETS = [
    './', './index.html', './styles.css', './app.js', './version.js',
    './manifest.json', './icon.svg',
    './icon-180.png', './icon-192.png', './icon-512.png',
    './screen01.png', './screen02.png', './screen03.png',
    './privacy.html', './terms.html', './about.html', './offline.html',
    './changelog.json'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(STATIC_CACHE).then(function(c) {
            return Promise.all(ASSETS.map(function(u) { return c.add(u).catch(function() {}); }));
        }).then(function() { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== STATIC_CACHE && k !== CACHE; })
                    .map(function(k) { return caches.delete(k); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    var url = new URL(e.request.url);

    if (e.request.mode === 'navigate') {
        e.respondWith(
            caches.match(e.request).then(function(cached) {
                var fetched = fetch(e.request).then(function(r) {
                    if (r && r.ok) {
                        var c = r.clone();
                        caches.open(CACHE).then(function(cache) { cache.put(e.request, c); });
                    }
                    return r;
                }).catch(function() { return caches.match(OFFLINE_URL); });
                return cached || fetched;
            })
        );
        return;
    }

    if (url.origin === self.location.origin) {
        var isStatic = /\.(js|css|png|svg|json|html|woff2?)$/.test(url.pathname);
        if (isStatic) {
            e.respondWith(
                caches.match(e.request).then(function(cached) {
                    var fetched = fetch(e.request).then(function(r) {
                        if (r && r.ok) {
                            var c = r.clone();
                            caches.open(STATIC_CACHE).then(function(cache) { cache.put(e.request, c); });
                        }
                        return r;
                    }).catch(function() { return cached; });
                    return cached || fetched;
                })
            );
            return;
        }
    }

    e.respondWith(
        fetch(e.request).then(function(r) {
            if (r && r.ok) {
                var c = r.clone();
                caches.open(CACHE).then(function(cache) { cache.put(e.request, c); });
            }
            return r;
        }).catch(function() {
            return caches.match(e.request).then(function(c) { return c || caches.match(OFFLINE_URL); });
        })
    );
});