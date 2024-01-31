import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
class RecipesDb {
    constructor() {
        this.isAvailable = false
    }
    open() {
        return new Promise((resolve, reject) => {
            try {
                console.log("open database");
                const firebaseConfig = {
                    apiKey: "AIzaSyAqIn8DZc4b1gns8vJyhcDaesklu1zyQt8",
                    authDomain: "simplifyrecipes-31b0a.firebaseapp.com",
                    projectId: "simplifyrecipes-31b0a",
                    storageBucket: "simplifyrecipes-31b0a.appspot.com",
                    messagingSenderId: "323447664235",
                    appId: "1:323447664235:web:2416536bea05805bea8b2e"
                  };
                const app = initializeApp(firebaseConfig);
                const db = getFirestore(app);
                if (db) {
                    this.isAvailable = true
                   this.db=db
                    resolve()

                }
            } catch (err) {
                reject(error.message)
            }


        })

    }
    add(recipeName, chefName,ingredients,image,steps) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const dbCollection = collection(this.db, "recipes");
            addDoc(dbCollection, {
                recipeName,
                chefName,
                ingredients,
                image,
                steps
            })
                .then((docRef) => {
                    console.log("Success: ", docRef.id);
                    resolve()
                })
                .catch((error) => {
                    reject(error.message)
                });
        })
    }
    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const dbCollection = collection(this.db, "recipes");
            getDocs(dbCollection)
                .then((querySnapshot) => {
                    const result = []
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        data.id = doc.id
                        result.push(data)
                    });
                    resolve(result)
                })
                .catch((error) => {
                    reject(error.message)
                });
        })
    }
    get(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not opened')
            }
            const docRef = doc(this.db, "recipes", id);
            getDoc(docRef)
                .then((docSnap) => {
                    const data = docSnap.data();
                    resolve(data)
                })
                .catch((error) => {
                    reject(error.message)
                });

        })
    }
}
export default new RecipesDb()