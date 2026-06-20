const CACHE = 'cf-v2.0.1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.json', './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).then(r => {
            if (r.ok) {
                var c = r.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, c));
            }
            return r;
        }).catch(() => caches.match(e.request))
    );
});
