import dbOnline from "./recipes-db-cloud.js"
import dboffline from './recipes-db-local.js'
class RecipesDb {
    constructor() {
       
        this.dbOnline = dbOnline
        this.dboffline = dboffline
        this.swRegistration=null
    } 
    open() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    if ('active' in registration && 'sync' in registration) {
                        this.dboffline.open()
                            .then(() => {
                                this.swController = registration.active;
                                this.swRegistration = registration;
                                console.log(this.swController );
                                this.dbOnline.open().then(resolve).catch(reject)
                            }).catch(() => {
                                this.dbOnline.open().then(resolve).catch(reject)
                            })

                    } else {
                        this.dbOnline.open().then(resolve).catch(reject)
                    }
                })
            } else {
                this.dbOnline.open().then(resolve).catch(reject)
            }



        })

    }
    add(recipeName, chefName, ingredients, image,steps) {

        if (navigator.onLine) {
            return this.dbOnline.add(recipeName, chefName, ingredients, image,steps);
        }
        else {
            this.swRegistration.sync.getTags()
                .then((tags) => {
                    if (!tags.includes('add-recepie')) {
                        
                        this.swRegistration.sync.register('add-recepie');
                    }
                });
            return this.dboffline.add(recipeName, chefName, ingredients, image);
        }

    }
    getAll() {
        
            if (navigator.onLine) {
                
              return  this.dbOnline.getAll()
            }else{
                return new Promise((resolve,reject)=>{
                    reject("Please connect to the database to see recepies")
                })
                
            }

        
    }
    get(id) {

        if (navigator.onLine) {
                
            return  this.dbOnline.get(id)
          }else{
              return new Promise((resolve,reject)=>{
                  reject("Please connect to the database to see recepies")
              })
              
          }
    }
}
export default new RecipesDb()