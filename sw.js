// WX service worker — caches the app shell so the app opens without a
// connection. Weather data (radar, HRRR, AFD) is never cached: stale weather
// shown as current would be worse than none.
const CACHE = 'wx-shell-v1';
const LEAFLET = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
const SHELL = ['./', 'manifest.webmanifest', 'apple_touch_icon.png', 'favicon.ico', ...LEAFLET];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // Leaflet is version-pinned, so cache-first is safe
    if (LEAFLET.includes(req.url)) {
        event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
        return;
    }

    // Own files: network-first so new deploys show up immediately,
    // falling back to the cached copy when offline
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy));
                    }
                    return res;
                })
                .catch(() => caches.match(req.mode === 'navigate' ? './' : req, { ignoreSearch: true }))
        );
    }
    // Everything else (weather data, map tiles) goes straight to the network
});
