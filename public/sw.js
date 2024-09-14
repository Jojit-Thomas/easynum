self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("easynum-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/favicon.ico", "/placeholder.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
