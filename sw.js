/* Orbita v2 Service Worker — build v94 */
const CACHE = 'orbita-v94';
const SHELL = [
  "js/data.js?v=94",
  "js/helpers.js?v=94",
  "js/emoji-picker.js?v=94",
  "js/achievements.js?v=94",
  "js/themes.js?v=94",
  "js/shell.js?v=94",
  "js/modals.js?v=94",
  "js/today.js?v=94",
  "js/legio.js?v=94",
  "js/habits.js?v=94",
  "js/pomodoro.js?v=94",
  "js/calendar.js?v=94",
  "js/shopping.js?v=94",
  "js/diet.js?v=94",
  "js/finance.js?v=94",
  "js/settings.js?v=94",
  "js/orbita-ai.js?v=94",
  "js/notes.js?v=94",
  "js/media.js?v=94",
  "js/history.js?v=94",
  "js/charts.js?v=94",
  "js/weekly.js?v=94",
  "js/onboarding.js?v=94",
  "js/landing.js?v=94",
  "js/screens.js?v=94",
  "js/app.js?v=94",
  "js/sprites.js?v=94",
  "js/legio-avatars.js?v=94",
  "js/google-calendar.js?v=94",
  "js/firebase-sync.js?v=94",
  "js/utils.js?v=94",
  "js/notify.js?v=94",
  "css/tokens.css?v=94",
  "css/app.css?v=94",
  "icon-180.png",
  "icon-180.svg",
  "manifest.json",
  "./",
  "index.html"
];
const CDN = ["https://unpkg.com/react@18.3.1/umd/react.production.min.js","https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js","https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js","https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // shell local (falha em um não derruba o resto)
    await Promise.allSettled(SHELL.map(u => c.add(u)));
    // libs CDN (opaque ok)
    await Promise.allSettled(CDN.map(u => c.add(new Request(u, { mode: 'no-cors' }))));
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isFirebase(url) {
  return /firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|firebaseio|googleapis\.com\/.*google/.test(url);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  // nunca cachear API do Firebase / OpenAI / Calendar — sempre rede
  if (isFirebase(url) || /api\.openai\.com|www\.googleapis\.com\/calendar/.test(url)) return;

  // navegação: rede primeiro, cai pro index em offline
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try { return await fetch(req); }
      catch { return (await caches.match('index.html')) || (await caches.match('./')) || Response.error(); }
    })());
    return;
  }

  // assets: cache primeiro, atualiza em background (stale-while-revalidate)
  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: false });
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
      }
      return res;
    }).catch(() => null);
    return cached || (await net) || Response.error();
  })());
});

// Clicar numa notificação foca (ou abre) o app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  })());
});
