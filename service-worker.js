import recipesDb from "./script/database/recipes-db.js"
const cacheName='cache-v1'

self.addEventListener('install', function (event) {
   self.skipWaiting();
    event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
        return cache.addAll(['/']);
    })
    );
    });
// Activate event
 self.addEventListener('activate', function (event) {
        console.log('[Service Worker] Activate:', event);
        // Claims control over all uncontrolled tabs/windows
        event.waitUntil(clients.claim());
        // Delete all old caches after taking control
        event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames
        .filter(item => item !== cacheName)
        .map(item => caches.delete(item))
        );
        }));
        });

self.addEventListener('fetch',function (event){
    if(event.request.method=="GET"){
         // Check if the request is for a Chrome extension resource
         if (event.request.url.startsWith('chrome-extension://')) {
            return;
        }
    event.respondWith(caches.open(cacheName)
    .then(function (cache) {
    return cache.match(event.request)
    .then(function (cachedResponse) {
    const fetchedResponse = fetch(event.request)
    .then(function (networkResponse) {
    cache.put(event.request, networkResponse.clone());
    return networkResponse;
    })
   
    return cachedResponse || fetchedResponse;
    });
    }));
}
})
// Background sync api
self.addEventListener('sync', (event)=>{
    
    console.log("background Sync",event)

    switch (event.tag)  {
         case 'my-tag-name':
         console.log ('Do something');
        break;
         case 'add-recepie':
         addRecepie();
        break;
    }

})


const addRecepie=()=>{
    
    recipesDb.dboffline.open().then(()=>{
    
        console.log('adddingg.....22');
    recipesDb.dboffline.getAll().then(recpies=>{

        recipesDb.dbOnline.open()
        .then(()=>{       
           
            recpies.forEach(recpie=>{
// console.log(recpie)


    clients.matchAll().then((clientsMatch) => {
    clientsMatch.forEach((client) => {
    // Do whatever is needed with the client,
    // including posting a message.
    
    client.postMessage({msg:'My message',payload:recpie});
    });
    });

    recipesDb.dboffline.delete(recpie.id).then(()=>{
        // console.log("Successfully deleted");
    
    }).catch((error) =>console.log(error));
                
            })


        }).catch((error) =>console.log(error));

      })
}).catch((error) =>console.log(error));
}

