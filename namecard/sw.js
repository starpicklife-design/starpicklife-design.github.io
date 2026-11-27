/* 와글링 명함집 · 가벼운 Service Worker (v1)
   - 홈 화면 설치 요건(매니페스트 + 아이콘 + fetch 핸들러) 충족
   - 화면은 네트워크 우선 → 새 버전이 바로 반영됨
   - 인터넷이 끊겨도 마지막으로 열었던 화면이 뜨도록 껍데기만 캐시
   - 명함·사진은 브라우저(localStorage)에만 있고, 어떤 요청도 다른 곳으로 보내지 않음 */

const CACHE = 'wagle-namecard-v1';
const SHELL = [
  './',
  './index.html',
  './app.js',
  './qr.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    try { await self.clients.claim(); } catch (e) {}
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith('/namecard/')) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put('./index.html', fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (e) {
        const cache = await caches.open(CACHE);
        return (await cache.match('./index.html')) || (await cache.match('./')) ||
          new Response('와글링 명함집 · 인터넷이 없어 화면을 열지 못했어요.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) cache.put(req, fresh.clone()).catch(() => {});
      return fresh;
    } catch (e) {
      return new Response('', { status: 504 });
    }
  })());
});
