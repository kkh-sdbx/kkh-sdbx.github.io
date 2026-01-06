console.log("service worker works!!");

const CACHE_NAME = 'appintos-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',  // 실제 CSS 파일명으로 변경
  '/script.js', // 실제 JS 파일명으로 변경
  '/logo600.png'
];

/*
// 1. 설치 단계: 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 네트워크 요청 가로채기: 캐시된 파일 우선 사용
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/