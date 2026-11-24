/* 와글링 첫 화면(모음 페이지) · 가벼운 Service Worker (v1)
   - 홈 화면 설치 요건(매니페스트 + 아이콘 + fetch 핸들러) 충족
   - 첫 화면(index.html)은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - 아이콘·매니페스트는 캐시 우선 → 인터넷이 느리거나 끊겨도 열림
   - 이 폴더(첫 화면) 밖의 주소(/menu/, /fit/ 등 각 앱)는 절대 건드리지 않음
     → 각 앱은 자기 sw.js 를 그대로 쓴다
   - 외부(다른 사이트) 요청도 그대로 통과 · 개인정보 0% */

const CACHE = 'wagling-portal-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];
const ROOT_FILES = [
  '', 'index.html', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'
];

function scopePath() {
  try { return new URL(self.registration.scope).pathname; } catch (e) { return '/'; }
}

function isPortalUrl(url) {
  const base = scopePath();               /* 예: /starpicklife-design.github.io/ */
  if (url.pathname.indexOf(base) !== 0) return false;
  const rest = url.pathname.slice(base.length);   /* '' · 'index.html' · 'menu/' … */
  return ROOT_FILES.indexOf(rest) !== -1;         /* 첫 화면 파일만 */
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => { /* 일부 파일이 없어도 설치는 계속 */ })
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
  if (url.origin !== self.location.origin) return;   /* 외부 요청은 그대로 통과 */
  if (!isPortalUrl(url)) return;                     /* 각 앱(/menu/ 등)은 손대지 않음 */

  const isPage = req.mode === 'navigate' || /(^|\/)($|index\.html$)/.test(url.pathname.slice(scopePath().length));

  if (isPage) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || caches.match('./index.html') ||
          new Response('와글링 · 인터넷이 없어 화면을 열지 못했어요. / Wagling · offline.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (e) {
      return caches.match('./index.html');
    }
  })());
});
