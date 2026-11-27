/* 🧠 와글링 두뇌놀이 · 가벼운 Service Worker
   - 홈 화면 설치 요건 충족 + 인터넷이 끊겨도 앱 껍데기만 열리도록 캐시
   - 외부 사이트 요청은 절대 가로채지 않음 · 개인정보 0%
   - 화면(index.html·app.js)은 항상 네트워크 우선 → 새 버전이 바로 반영됨 */

const CACHE = 'brain-v1';
const SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => { /* 일부 파일이 없어도 설치는 계속 */ })
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
  if (url.origin !== self.location.origin) return;            // 외부 요청은 그대로 통과
  if (url.pathname.indexOf('/brain/') === -1) return;        // brain/ 밖은 건드리지 않음

  // 화면 열기: 네트워크 우선, 실패하면 캐시된 화면
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
               new Response('와글링 두뇌놀이 · 인터넷이 없어 열지 못했어요. / Wagling Brain Play · offline.', {
                 status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
               });
      }
    })());
    return;
  }

  // 스크립트·아이콘·매니페스트: 캐시 우선 (없으면 받아서 저장)
  if (/\.(png|svg|webp|jpe?g|webmanifest|ico|json|js|css)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) {
        // app.js 는 뒤에서 조용히 새 버전을 받아 둔다
        if (/app\.js$/.test(url.pathname)) {
          fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); }).catch(() => {});
        }
        return hit;
      }
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    })());
  }
});
