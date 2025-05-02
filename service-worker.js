const CACHE_NAME = "corredor-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./joystick.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Ativa imediatamente
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Toma controle das páginas abertas
});

// Intercepta requisições e serve do cache ou rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          // Requisições falharam (offline e sem cache)
          caches.match("./index.html")
        )
      );
    })
  );
});
