/* Orbita v2 Service Worker — build v100 */
const CACHE = 'orbita-v100';
const SHELL = [
  "js/data.js?v=100",
  "js/helpers.js?v=100",
  "js/emoji-picker.js?v=100",
  "js/achievements.js?v=100",
  "js/themes.js?v=100",
  "js/shell.js?v=100",
  "js/modals.js?v=100",
  "js/today.js?v=100",
  "js/legio.js?v=100",
  "js/habits.js?v=100",
  "js/pomodoro.js?v=100",
  "js/calendar.js?v=100",
  "js/shopping.js?v=100",
  "js/diet.js?v=100",
  "js/finance.js?v=100",
  "js/settings.js?v=100",
  "js/orbita-ai.js?v=100",
  "js/notes.js?v=100",
  "js/media.js?v=100",
  "js/history.js?v=100",
  "js/charts.js?v=100",
  "js/weekly.js?v=100",
  "js/onboarding.js?v=100",
  "js/landing.js?v=100",
  "js/screens.js?v=100",
  "js/app.js?v=100",
  "js/sprites.js?v=100",
  "js/legio-avatars.js?v=100",
  "js/google-calendar.js?v=100",
  "js/firebase-sync.js?v=100",
  "js/utils.js?v=100",
  "js/notify.js?v=100",
  "css/tokens.css?v=100",
  "css/app.css?v=100",
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
