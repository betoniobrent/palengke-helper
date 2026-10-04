const CACHE_NAME = 'palengke-helper-v69';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/tailwind.css?v=1',
  '/navigation.js?v=1',
  '/theme.js?v=1',
  '/daily-home.js?v=1',
  '/app.js',
  '/tutorial.js',
  '/tutorial-tabs.js',
  '/meal-costing.js',
  '/supabase.js',
  '/data/recipes.js',
  '/data/prices.json',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(cached => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
