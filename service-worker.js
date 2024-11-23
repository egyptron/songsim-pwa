// Name of the cache you want to use
const CACHE_NAME = 'bitra-read-pwa-cache-v1';

// List of URLs to cache
const urlsToCache = [
    '/', // The root URL
    '/index.html', // Your HTML file
    '/style.css', // Your CSS file
    '/manifest.json', // Your manifest file
    '/icon-192x192.png', // Your 192px icon
    '/icon-512x512.png', // Your 512px icon
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js' // External dependencies
];

// Install service worker and cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching assets');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});

// Fetch data from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // If cached response is found, serve it, otherwise fetch from network
            return cachedResponse || fetch(event.request);
        })
    );
});
