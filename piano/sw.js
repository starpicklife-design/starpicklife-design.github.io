/* 와글링 피아노 · 가벼운 Service Worker (v2)
   - 홈 화면 설치 요건(매니페스트 + 아이콘 + fetch 핸들러) 충족
   - 화면(index.html)은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - 인터넷이 끊겨도 마지막으로 열었던 화면이 뜨도록 껍데기만 캐시
   - 소리(Web Audio)는 기기 안에서 만들어지므로 인터넷이 필요 없음
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0% */

const CACHE = 'wagle-piano-v2';
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
  if (!url.pathname.startsWith('/piano/')) return;

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
          new Response('와글링 피아노 · 인터넷이 없어 화면을 열지 못했어요. / Wagling Piano · offline.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  if (/\.(png|svg|webmanifest|ico|json)$/i.test(url.pathname)) {
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
