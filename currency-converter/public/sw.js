let staticCacheName = 'cc-static-v1';
let flagsCache = 'cc-currency-flags-v1';
let dataCache = 'cc-data-v1';

let allCaches = [
  staticCacheName,
  flagsCache,
  dataCache
];

let urlsToCache = [
  '/',
  '/rates',
  '/js/init.js',
  '/js/index.js',
  '/js/materialize.js',
  '/css/materialize.css',
  '/css/style.css',
  '/flags/placeholder.png',
  'https://code.jquery.com/jquery-2.1.1.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function(event) {
  console.log('installed');
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log('activating...');
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

self.addEventListener('waiting', function() {
  console.log('SW is in waiting state')
});

self.addEventListener('fetch', function(event) {

  const url = new URL(event.request.url);

  // cache material icons
  if (url.hostname === 'fonts.gstatic.com') {
    caches.match(url.href).then(function(response) {
      return response || fetch(event.request);
    })
  }

  // cache data
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(dataCache).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        }).catch(function() {
          if (url.pathname.startsWith('/api/convert')) {
            let baseCurrency = url.searchParams.get('from');
            let quoteCurrency = url.searchParams.get('to');
            let amount = url.searchParams.get('amount');
            return caches.match(`/api/rates?base=${baseCurrency}`)
              .then(function(response) {
                console.log(`${url.protocol}//${url.host}/api/rates?base=${baseCurrency}`);
                let convertedAmount = response.rates[quoteCurrency] * amount;
                return {time: response.time, amount: convertedAmount.toString()}
              })  
          }
          return caches.match(event.request.url).then(function(response) {
            if (response) return response;
            // return 'NIL';
          });
        });
      })
    );
  }

  // cache and serve flags
  // else if (url.pathname.startsWith('/flags/')) {
  //   event.respondWith(serveFlag(event.request));
  // }

  else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});


function serveFlag(request) {

  return caches.open(flagsCache).then(function(cache) {
    return cache.match(request.url).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(request).then(function(networkResponse) {
        if (!response) {
          return caches.match('/flags/placeholder.png').then(function(placeholderResponse) {
            return placeholderResponse;
          })
        }
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
