importScripts('/src/js/idb');
console.log(idb);
const CACHE_STATIC_NAME = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
      '/',
      '/index.html',
      '/src/js/app.js',
      '/src/js/main.js',
      '/src/js/idb.js',
      '/src/js/material.min.js',
      '/src/css/app.css',
      '/src/css/feed.css',
      'https://fonts.googleapis.com/css?family=Roboto:400,700',
      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
      'https://free.currencyconverterapi.com/api/v5/currencies',
      'https://fonts.googleapis.com/icon?family=Material+Icons'

];

const dbPromise = idb.open('post-store', 1, function(db) {
   if ( !db.objectStoreNames.contains('posts')) {
     db.createObjectStore(' posts', {keyPath: 'id'})
   }
})
self.addEventListener("install",  function (event) {
  console.log('[service worker]: Installing', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function(cache) {
      console.log('[service worker]: Precaching app shell' );
      cache.addAll(STATIC_FILES);
    })
  );
})

self.addEventListener('activate', function(event) {
  console.log('[Service Worker]: Activating...', event);
  event.waitUntil(
    caches.keys()
    .then(function(keyList){
      return Promise.all(keyList.map(function(key) {
        if (key !==CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log("[Service Worker]: removing old cache.", key);
          return caches.delete(key);
        }
      }));
    })
  );
})

self.addEventListener('fetch', function(event) {

     event.respondWith(
       caches.match(event.request)
       .then(function(response) {
         if (response) return response;
         return fetch(event.request)
          .then(function(res) {
            return caches.open(CACHE_DYNAMIC_NAME)
             .then(function(cache){
               cache.put(event.request.url, res.clone());
               return res;
             })
          })
          .catch(function(err) {

          });
       })
     )
   })