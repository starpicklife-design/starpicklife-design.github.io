/* 다이아몬드 성 탈출 다꾸 · 가벼운 Service Worker
   - 홈 화면 설치 요건 충족 + 인터넷이 끊겨도 앱 껍데기만 열리도록 캐시
   - 외부(다른 사이트·날씨 API·글꼴) 요청은 절대 가로채지 않음 · 개인정보 0%
   - 화면(index.html)은 항상 네트워크 우선 → 새 버전이 바로 반영됨 */

const CACHE = 'wagle-diary-v2';
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
  if (url.origin !== self.location.origin) return; // 외부 요청은 그대로 통과

  // 화면은 네트워크 우선, 실패하면 캐시
  if (req.mode === 'navigate' || url.pathname.endsWith('/diary/') || url.pathname.endsWith('/diary/index.html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // 나머지 껍데기 파일은 캐시 우선
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});
