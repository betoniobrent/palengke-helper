const CACHE_NAME = 'palengke-helper-v91';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/print.html',
  '/print.css',
  '/print.js',
  '/shared.html',
  '/shared-viewer.js',
  '/style.css',
  '/tailwind.css?v=1',
  '/navigation.js?v=1',
  '/events.js?v=1',
  '/theme.js?v=1',
  '/bootstrap.js?v=1',
  '/vendor/supabase-2.117.2.js',
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
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && ['/print.html', '/print.js', '/shared.html', '/shared-viewer.js'].includes(url.pathname)) {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy))); }
      return response;
    }).catch(() => caches.match(event.request, {ignoreSearch:true})));
    return;
  }
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
