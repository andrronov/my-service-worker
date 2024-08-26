const CacheKey = 'cache-v1'

async function initCache(){
   try {
      let cache = await caches.open(CacheKey)
      console.log('cacacac ', cache);
      return cache.addAll(['./index.html', './index2.html'])
   } catch (err) {
      console.error(err);   
   }
}
function tryConnect(req, timeout){
   console.log('Trying... ', req, timeout);
   return new Promise((res, rej) => {
      const timeoutId = setTimeout(rej, timeout)
      fetch(req).then(response => {
         clearTimeout(timeoutId)
         const resClone = response.clone()
         caches.open(CacheKey).then(cache => {
            cache.put(req, resClone)
         })
         res(response)
      }, rej)
   })
}
async function getFromCache(req){
   console.log('Get from cache')
   const cache = await caches.open(CacheKey);
   const res = await cache.match(req);
   return res || Promise.reject("no-match");
}

self.addEventListener('install', e => {
   console.log('Installed');
   e.waitUntil(initCache())
})
self.addEventListener('activate', e => {
   console.log('Activated');
   e.waitUntil(
      caches.keys().then(keys => {
         console.log('keys ', keys);
         return Promise.all(keys.map(key => {
            if(key !== CacheKey) return caches.delete(key)
         }))
      })
   )
})
self.addEventListener('fetch', e => {
   console.log('Try network');
   e.respondWith(tryConnect(e.request, 400).catch(() => getFromCache(e.request)))
})




// onmessage = function (e) {
//    console.log("Message received from main script");
//    var workerResult = "Result: " + e.data[0] * e.data[1];
//    console.log("Posting message back to main script");
//    postMessage(workerResult);
//  };
   // return caches.open(CacheKey).then(cache => {
   //    return cache.addAll([
   //       './index.html'
   //    ])
   // })
 