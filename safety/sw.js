/* ⚡🚒 와글링 수호대 — 서비스 워커
   · /safety/ 안의 화면만 담당해요. 화면은 네트워크 우선, 끊기면 캐시로 열려요.
   · 날씨(Open-Meteo)·폰트(Google) 같은 바깥 주소는 그대로 지나가게 둡니다. */
const CACHE = 'wagle-guardians-v3';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // 폰트·날씨는 그대로

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
