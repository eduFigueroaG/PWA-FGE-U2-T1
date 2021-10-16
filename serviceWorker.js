const CACHE_STATIC_NAME = "static-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";
const CACHE_DINAMYC_NAME = "dinamyc-v1";

function cleanCache(cacheName, sizeItems) {
    caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            if (keys.length >= sizeItems) {
                cache.delete(keys[0]).then(() => {
                    cleanCache(cacheName, sizeItems);
                });
            }
        });
    });
}
self.addEventListener("install", (event) => {
    const cachePromise = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll([
            "./",
            "./index.html",
            "./manifest.json",
            "./images/icons/android-launchericon-144-144.png",
            "./images/icons/android-launchericon-192-192.png",
            "./images/icons/android-launchericon-48-48.png",
            "./images/icons/android-launchericon-512-512.png",
            "./images/icons/android-launchericon-72-72.png",
            "./images/icons/android-launchericon-96-96.png",
            "./js/app.js",
        ]);
    });

    const immutablePromise = caches
        .open(CACHE_INMUTABLE_NAME)
        .then((immutableCache) => {
            return immutableCache.addAll([
                "./css/bootstrap.min.css",
                "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js",
                "https://code.jquery.com/jquery-3.5.1.min.js",
            ]);
        });

    event.waitUntil(Promise.all([cachePromise, immutablePromise]));
});

self.addEventListener("fetch", (event) => {
    const cacheAnswer = caches.match(event.request).then((response) => {
        if (response) {
            return response;
        }
        console.log("No cache", event.request.url);
        return fetch(event.request).then((respNet) => {
            caches.open(CACHE_DINAMYC_NAME).then((cache) => {
                cache.put(event.request, respNet).then(() => {
                    cleanCache(CACHE_DINAMYC_NAME, 6);
                });
            });

            return respNet.clone();
        });
    });
    event.respondWith(cacheAnswer);
});