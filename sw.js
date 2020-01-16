const version = "1.0";

const appPath = "app";
const appPathReg = new RegExp(`^${appPath}`);

const offlineFallback = ["maintenance.html"];
const shellCacheName = "pipaCache" + `-${version}`;
const shellCacheFiles = [
  offlineFallback
];

const imgCacheName = "imgCache";

const contentCacheName = "contentCache" + `-${version}`;
const contentCacheFiles = [offlineFallback];

self.addEventListener("install", event => {
  // These items won't block the installation
  // caches.open(contentCacheName).then(contentCache => {
  //   contentCache.addAll(contentCacheFiles);
  // });
  // These items must be cached for the Service Worker to complete installation
  // event.waitUntil(
  // caches.open(shellCacheName).then(shellCache => {
  //   return shellCache.addAll(shellCacheFiles).then(() => {
  //     self.skipWaiting();
  //   });
  // })
  // );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  // if (requestUrl.origin !== self.location.origin) {
  //   return;
  // }


  if (request.destination !== "text/html") {
    event.respondWith(
      caches.open(imgCacheName).then(cache => {
        return cache.match(request).then(cacheResponse => {
          let fetchPromise = fetch(request).then(serverResponse => {
            // Resource provided by the server
            if (serverResponse.status !== 200) {
              // Only cache valid responses (prevent caching of 40x or 50x errors)
              return serverResponse;
            }
            // Stash a copy of this page in the pages cache
            let copy = serverResponse.clone();
            cache.put(request, copy).then(() => {});
            return serverResponse;
          });
          return cacheResponse || fetchPromise;
        });
      })
    );
  }
  // else if (
  //   shellCacheFiles.indexOf(requestUrl.pathname.replace(appPathReg, "")) !== -1
  // ) {
  //   // Deal with Shell resources as Cache First
  //   event.respondWith(
  //     caches.open(shellCacheName).then(shellCache => {
  //       return shellCache.match(request).then(cacheResponse => {
  //         // Resource available in cache
  //         let fetchPromise = fetch(request).then(serverResponse => {
  //           // Resource provided by the server
  //           if (serverResponse.status !== 200) {
  //             // Only cache valid responses (prevent caching of 40x or 50x errors)
  //             return serverResponse;
  //           }
  //           // Stash a copy of this page in the pages cache
  //           let copy = serverResponse.clone();
  //           shellCache.put(request, copy);
  //           return serverResponse;
  //         });
  //         return cacheResponse || fetchPromise;
  //       });
  //     })
  //   );
  // } else {
  // Deal with content as Network First
  // event.respondWith(
  //   fetch(request).then(response => {
  //     // Resource provided by the server
  //     if (response.status !== 200) {
  //       // Only cache valid responses (prevent caching of 40x or 50x errors)
  //       return response;
  //     }
  //     // Stash a copy of this page in the content cache
  //     let copy = response.clone();
  //     caches
  //       .open(contentCacheName)
  //       .then(contentCache => contentCache.put(request, copy));
  //     return response;
  //   })
  // );
  // return;
  // }
});
