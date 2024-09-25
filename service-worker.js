// service-worker.js

// Cache version
const CACHE_NAME = 'pwa-cache-v1';

// Files to cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html', // Include your offline fallback page
  // Add other assets here (CSS, JS files, etc.)
];

// Install event - caching files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch event - serving cached files and offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached response if found, otherwise fetch it
      return response || fetch(event.request).catch(() => {
        // If fetch fails, return the offline page
        return caches.match('/offline.html');
      });
    })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
