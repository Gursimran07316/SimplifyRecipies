
class RecipesDb {
    constructor() {
        this.db=null
        this.isAvailable = false
    }
    open() {
        return new Promise((resolve, reject) => {
            if(indexedDB){
                const request = indexedDB.open('Recipes', 2);
                request.onerror = function (event) {
                   reject(event.target.message);
                    };
                    request.onsuccess =  (event)=> {
                   const db=event.target.result;
                   if(db){
                    this.db=db;
                    this.isAvailable=true;
                    resolve()
                   }else{
                    reject("Can't find database")
                   }
                }
                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
    
                    // Check if the object store already exists
                    if (!db.objectStoreNames.contains('RecipesList')) {
                        // Create an object store for this database
                        const objectStore = db.createObjectStore('RecipesList', { keyPath: 'id', autoIncrement: true });
    
                        // Optionally create an index for searching by recipeName
                        // objectStore.createIndex('recipeNameIndex', 'recipeName', { unique: false });
    
                        console.log(objectStore);
                    }
                };
                    
              }else{
                reject("Your browser doesnot support indexdb database")
              }
        })

    }
    add(recipeName, chefName,ingredients,image,steps) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const transaction = this.db.transaction(['RecipesList'], 'readwrite');
            transaction.onerror = function (event) {
                reject(event.target.message)
                };
            transaction.oncomplete = function (event) {
            console.log('All data added to the database!', event);
            };
        //    Store handlers
            const objectStore = transaction.objectStore('RecipesList');
            const storeRequest = objectStore.add({
            id: Date.now(),
            recipeName,
                chefName,
                ingredients,
                image,
                steps
            });
            storeRequest.onerror=event=>{
                console.log('Store [add] error',event);
                reject(event.target.message)
            }
            storeRequest.onsuccess=event=>{
                console.log('Store [add] error',event);
                resolve()
            }
        })
    }
    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const transaction = this.db.transaction(['RecipesList'],'readonly');
            transaction.onerror = function (event) {
                reject(event.target.message)
                };
            const objectStore = transaction.objectStore('RecipesList');
            const request = objectStore.getAll();
            request.onerror=event=>{
                console.log('Store [addAll] error',event);
                reject(event.target.message)
            }
            request.onsuccess = function (event) {
            // Do something with the request.result!
            resolve(event.target.result)
            };
        })
    }
    get(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const transaction = this.db.transaction(['RecipesList'],'readonly');
            transaction.onerror = function (event) {
                reject(event.target.message)
                };
                
            const objectStore = transaction.objectStore('RecipesList');
            const request = objectStore.get(id);
            request.onerror=event=>{
                console.log('Store [addAll] error',event);
                reject(event.target.message)
            }
            request.onsuccess = function (event) {
            resolve(event.target.result)
            };
        })
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const transaction = this.db.transaction(['RecipesList'],'readwrite');
            transaction.onerror = function (event) {
                reject(event.target.message)
                };
                
            const objectStore = transaction.objectStore('RecipesList');
            const request = objectStore.delete(id);
            request.onerror=event=>{
                console.log('Store [delete] error',event);
                reject(event.target.message)
            }
            request.onsuccess = function (event) {
            resolve()
            };
        })
    }
}
export default new RecipesDb()