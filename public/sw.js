importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@0.0.9/dist/scramjet.all.js");
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const sw = new ScramjetServiceWorker();
self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    await sw.loadConfig();
    if (sw.route(event)) return sw.fetch(event);
    return fetch(event.request);
  })());
});
