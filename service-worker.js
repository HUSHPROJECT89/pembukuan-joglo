const cacheName = 'joglo-banteran-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/menu.html',
  '/pembayaran.html',
  '/pendapatan.html',
  '/style.css',
  '/script.js',
  '/bg-beranda.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
