/* 와글링 영어블랙홀 · 가벼운 Service Worker
   - 홈 화면 설치 요건을 채우고, 인터넷이 끊겨도 문장과 복습 일정이 열리도록 앱 껍데기만 캐시
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0%
   - index.html은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - v1 (2026-11-27): 여행영어 49문장 · 3·7·14·30일 블랙홀 복습 · 한/EN 첫 배포본
   - v2 (2026-11-28): 📲 설치 버튼 — 앱(standalone) 화면 안에서 열렸을 때도 설치 안내를 띄우고
     '단독 아이콘' 안내 + 삼성 인터넷 길잡이 + 🔗 주소 복사 버튼 추가 */

const CACHE = 'wagle-english-hole-v2';
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
               new Response('와글링 영어블랙홀 · 인터넷이 없어 열지 못했어요. / Wagling English Black Hole · offline.', {
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
