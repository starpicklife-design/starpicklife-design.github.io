/* 와글링 한국여행 · 가벼운 Service Worker
   - 홈 화면 설치 요건을 채우고, 인터넷이 끊겨도 관광지 목록이 열리도록 앱 껍데기만 캐시
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0%
   - index.html은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - 내 사진·메모는 이 폰의 localStorage에만 있고 서버로 가지 않음
   - v3 (2026-11-27): 명소 그림(SVG) 제거 · 내 사진 채우기·앨범 인쇄(책자) · 목록 글씨 잘림 수정 */

const CACHE = 'wagle-korea-travel-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL).catch(() => { /* 일부가 없어도 설치는 계속 */ });
  })());
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
  if (url.origin !== self.location.origin) return; /* 외부 요청은 그대로 통과 */

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
        return (await cache.match('./index.html')) ||
               (await cache.match('./')) ||
               new Response('와글링 한국여행 · 인터넷이 없어 열지 못했어요. / Wagling Korea Travel · offline.', {
                 status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
               });
      }
    })());
    return;
  }

  if (/\.(png|svg|webp|jpe?g|webmanifest|ico|json)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    })());
  }
});
