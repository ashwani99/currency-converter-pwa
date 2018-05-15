let staticCacheName = 'cc-static-v1';
let flagsCache = 'cc-currency-flags';
let allCaches = [
  staticCacheName,
  flagsCache
];

let urlsToCache = [
  '/',
  '/js/init.js',
  '/js/index.js',
  '/js/materialize.js',
  '/css/materialize.css',
  '/css/style.css',
  '/flags/placeholder.png',
  'https://code.jquery.com/jquery-2.1.1.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('cc-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


function serveFlag(request) {

  return caches.open(flagsCache).then(function(cache) {
    return cache.match(request.url).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      }).catch(function() {
        return caches.match('/flags/placeholder.png').then(function(placeholderResponse) {
          return placeholderResponse;
        })
      });
    });
  });
}
