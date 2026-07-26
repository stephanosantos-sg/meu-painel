/* Orbita v2 Service Worker — build v97 */
const CACHE = 'orbita-v97';
const SHELL = [
  "js/data.js?v=97",
  "js/helpers.js?v=97",
  "js/emoji-picker.js?v=97",
  "js/achievements.js?v=97",
  "js/themes.js?v=97",
  "js/shell.js?v=97",
  "js/modals.js?v=97",
  "js/today.js?v=97",
  "js/legio.js?v=97",
  "js/habits.js?v=97",
  "js/pomodoro.js?v=97",
  "js/calendar.js?v=97",
  "js/shopping.js?v=97",
  "js/diet.js?v=97",
  "js/finance.js?v=97",
  "js/settings.js?v=97",
  "js/orbita-ai.js?v=97",
  "js/notes.js?v=97",
  "js/media.js?v=97",
  "js/history.js?v=97",
  "js/charts.js?v=97",
  "js/weekly.js?v=97",
  "js/onboarding.js?v=97",
  "js/landing.js?v=97",
  "js/screens.js?v=97",
  "js/app.js?v=97",
  "js/sprites.js?v=97",
  "js/legio-avatars.js?v=97",
  "js/google-calendar.js?v=97",
  "js/firebase-sync.js?v=97",
  "js/utils.js?v=97",
  "js/notify.js?v=97",
  "css/tokens.css?v=97",
  "css/app.css?v=97",
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
