self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch handler. Availability and pricing change constantly,
// so we deliberately don't cache responses — this only exists because
// Chrome requires a registered fetch handler for install eligibility.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
