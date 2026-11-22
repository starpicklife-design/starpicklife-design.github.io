/* 와글가족장바구니 · 가벼운 Service Worker (v16 — 첫 화면 아래 카드를 '🏠 우리 집 전체 내역'으로: 보관 공간 5칸(냉장고·냉동실·야채·과일·김치냉장고·실온보관바구니)의 품목을 칸별 알약으로 한눈에 보여 주고 칸 줄을 누르면 그 칸이 바로 열립니다(빈 칸은 '비어 있어요' 1줄). 지붕 🏠 우리 집 전체 내역 모달은 그대로. 페이지를 아래로 내리면 오른쪽 아래에 '⬆️ 맨 위로' 버튼이 떠서 한 번에 맨 위로. 보관 공간 5칸·영수증·요리 안내·와글가족 캐릭터·같은 품목 수량 자동 +1·용량/유통기한·폰 뒤로가기)
   - 홈 화면 설치 요건(매니페스트 + 아이콘 + fetch 핸들러) 충족
   - 화면(index.html)은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - 인터넷이 끊겨도 마지막으로 열었던 화면이 뜨도록 껍데기만 캐시
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0% */

const CACHE = 'wagle-fridge-v16';
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
  if (!url.pathname.startsWith('/fridge/')) return;

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
          new Response('와글가족장바구니 · 인터넷이 없어 화면을 열지 못했어요. / Wagulcart · offline, the page could not be opened.', {
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
