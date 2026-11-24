/* 와글링 장바구니 · 가벼운 Service Worker (v19 — 칸(칸 화면)마다 바탕·머리말·카드 색을 다르게: 냉장고 민트 · 냉동실 얼음 하늘 · 야채·과일 새잎 연두 · 김치냉장고 살구 · 실온보관바구니 버터. 칸을 넘길 때 색이 부드럽게 바뀌고, 품목 카드 왼쪽에는 그 칸 색 띠가 생겨 글자를 읽지 않아도 어느 칸인지 바로 보임. 보관 공간 5칸·전체 내역·맨 위로·영수증·요리 안내·와글가족 캐릭터·같은 품목 수량 자동 +1·용량/유통기한·식재료/반찬류/소스 탭·폰 뒤로가기는 그대로)
   - 홈 화면 설치 요건(매니페스트 + 아이콘 + fetch 핸들러) 충족
   - 화면(index.html)은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - 인터넷이 끊겨도 마지막으로 열었던 화면이 뜨도록 껍데기만 캐시
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0% */

const CACHE = 'wagle-fridge-v20';
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
          new Response('와글링 장바구니 · 인터넷이 없어 화면을 열지 못했어요. / Wagling Cart · offline, the page could not be opened.', {
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
