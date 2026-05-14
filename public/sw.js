importScripts("/scramjet/scramjet.worker.js");

const sw = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  if (sw.route(event)) {
    event.respondWith(sw.fetch(event));
  }
});
