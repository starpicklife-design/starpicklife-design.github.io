/* 와글 식탁 통역 · 가벼운 Service Worker
   - 홈 화면 설치 요건 충족 + 인터넷이 끊겨도 주문 카드가 열리도록 앱 껍데기만 캐시
   - 외부(다른 사이트) 요청은 절대 건드리지 않음 · 개인정보 0%
   - index.html은 항상 네트워크 우선 → 새 버전이 바로 반영됨
   - v4: 📍 내 위치 주소 · 🪧 간판 45종 2초 알림 · 🗣️ 여기 어떤 곳이에요? 배너
   - v5: 언어 버튼 5칸 꽉 채우기(가로 5등분) · 표지 흰 문구칸 삭제 · 좌우 여백 줄임 · 자동번역 방지(notranslate)
   - v6: 간판 버튼 안 그림(이모지) 삭제 → 글씨만 큼직하게 · 글자 사이/줄 사이 여유(letter-spacing·line-height) · 영어 모드 검수
   - v7: 슬로건·날씨 알약 한 단계 크게 · 내 위치(GPS) 날씨 + 역지오코딩 도시명 5개국어 · 알약 톡 누르면 내 위치 날씨 새로고침
   - v8: 4개 페이지(식당·간판 / 카페 메뉴 / 교통·길찾기 / 여행 일기) 분리 · 위·아래 전환 바 · 메뉴↔일기↔교통 연동 · 폰 뒤로가기 스택 · 카페 메뉴 10종(그림 3종 추가)
   - v9: 카페 그림 위 － 수량 ＋ 스테퍼(그림·＋ = +1, － = -1) · 카페 메뉴 20종(전통차·에이드·라떼·식혜 10종 그림 추가)
   - 메뉴판 사진 OCR(Tesseract.js CDN)은 그대로 통과 */

const CACHE = 'wagle-dining-v9';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './home-dining.webp',
  './home-dining.jpg',
  './sample-menu.jpg'
];
/* 그림 메뉴 · 음료 · 카페 사진 (하나씩 담아 실패해도 앱은 그대로 열림) */
const IMAGES = [
  './food/hot-americano.webp',
  './food/americano.webp',
  './food/beer.webp',
  './food/bibim-naengmyeon.webp',
  './food/bibimbap.webp',
  './food/bingsu.webp',
  './food/budae-jjigae.webp',
  './food/bulgogi.webp',
  './food/cafe-latte.webp',
  './food/cake.webp',
  './food/chicken.webp',
  './food/dak-galbi.webp',
  './food/doenjang-jjigae.webp',
  './food/dolsot-bibimbap.webp',
  './food/donkkaseu.webp',
  './food/galbitang.webp',
  './food/gimbap.webp',
  './food/japchae.webp',
  './food/jeyuk.webp',
  './food/kalguksu.webp',
  './food/kimchi-jjigae.webp',
  './food/makgeolli.webp',
  './food/mandu.webp',
  './food/matcha-latte.webp',
  './food/goguma-latte.webp',
  './food/grapefruit-ade.webp',
  './food/peach-iced-tea.webp',
  './food/naengmyeon.webp',
  './food/pajeon.webp',
  './food/ramyeon.webp',
  './food/samgyeopsal.webp',
  './food/samgyetang.webp',
  './food/seolleongtang.webp',
  './food/soda.webp',
  './food/soju.webp',
  './food/sundubu-jjigae.webp',
  './food/tteokbokki.webp',
  './food/vanilla-latte.webp',
  './food/water.webp',
  './food/yuja-tea.webp',
  './food/jujube-tea.webp',
  './food/ginger-tea.webp',
  './food/ssanghwa-tea.webp',
  './food/omija-tea.webp',
  './food/maesil-tea.webp',
  './food/lemon-ade.webp',
  './food/strawberry-latte.webp',
  './food/milk-tea.webp',
  './food/choco-latte.webp',
  './food/sikhye.webp'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL).catch(() => { /* 일부 파일이 없어도 설치는 계속 */ });
    await Promise.all(IMAGES.map((u) => cache.add(u).catch(() => {})));
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
  if (url.origin !== self.location.origin) return; // 외부 요청(OCR 엔진 등)은 그대로 통과

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
               new Response('와글 식탁 통역 · 인터넷이 없어 열지 못했어요. / Wagul Dining · offline.', {
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
