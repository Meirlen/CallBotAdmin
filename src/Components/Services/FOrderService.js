import { collection, doc, query, where , getDocs, addDoc, onSnapshot, setDoc, orderBy, limit, startAfter, startAt, endBefore, getDoc, deleteDoc} from "firebase/firestore"; 
import { firestoreDb } from "../../firebase-config";

const audio = new Audio('/sounds/new_message.mp3');

//TODO: разбить на функции работы с базой данных
class FOrderService {

    init = true;
    setCollectionCallbackValue = null;
    collectionUnsub = null;
    lastElement = null;

    setCollectionCallback(callback) {
        this.setCollectionCallbackValue = callback;
    }

    /*
        documentKey = "orders"
        documentId = "ATGTjZ15V6d5lGYhs4zA"
        data = {
            createdAt: "10-10-2010",
            from: "from",
            status: "decline",
            to: "to" ,
        }
    */
    async fCreate (documentKey, data) {
        try {
            const docRef = await addDoc(collection(firestoreDb, documentKey), data);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    /*
        documentKey = "orders"
        documentId = "ATGTjZ15V6d5lGYhs4zA"
        data = {
            createdAt: "10-10-2010",
            from: "from",
            status: "decline",
            to: "to" ,
        }
    */
    async fUpdate (documentKey, documentId, data) {
        await setDoc(doc(firestoreDb, documentKey, documentId), data);
    }

    async fSelectWithUpdates () {
        const unsub = onSnapshot(doc(firestoreDb, "orders"), (doc) => {
            console.log("Current data: ", doc.data());
        });
    }

    /*
        documentKey = "orders"
        documentId = "ATGTjZ15V6d5lGYhs4zA"
        data = {
            createdAt: "10-10-2010",
            from: "from",
            status: "decline",
            to: "to" ,
        }
    */
    async fSelect(documentKey, callback, orderByField = null, orderByType = null, count = 5, type = null) {
        //TODO: order by
        //const q = query(citiesRef, orderBy("name", "desc"), limit(3));
        let queryConstraints = [limit(count)];
        if (orderByField != null) {
            queryConstraints.push(orderBy(orderByField, orderByType));
        }
        if (this.lastElement != null && type === 'next') {
            console.log(this.lastElement);
            queryConstraints.push(startAfter(this.lastElement));
        }
        if (this.lastElement != null && type === 'prev') {
            console.log(this.lastElement);
            queryConstraints.push(endBefore(this.lastElement));
        } 
        let q = query(collection(firestoreDb, documentKey), ...queryConstraints);
        const documentSnapshots = await getDocs(q);
        this.lastElement = documentSnapshots.docs[documentSnapshots.docs.length-1];


        let self = this;
        this.collectionUnsub = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({key: doc.id, data:doc.data() });
                //self.lastElement = doc;
            });
            if (callback !== undefined) {
                callback(list);
            }
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        console.log(' last element q ', this.lastElement);
    }

    /*
        documentKey = "orders"
        documentId = "ATGTjZ15V6d5lGYhs4zA"
        data = {
            createdAt: "10-10-2010",
            from: "from",
            status: "decline",
            to: "to" ,
        }
    */
    async fSelectWithQuery(documentKey, callback,  status, orderByField = null, orderByType = null, count = 5, type = null) {
        let queryConstraints = [ where("status", "==", status), limit(count)];
        if (orderByField != null) {
            queryConstraints.push(orderBy(orderByField, orderByType));
        }
        if (this.lastElement != null && type === 'next') {
            console.log(this.lastElement);
            queryConstraints.push(startAfter(this.lastElement));
        }
        if (this.lastElement != null && type === 'prev') {
            console.log(this.lastElement);
            queryConstraints.push(endBefore(this.lastElement));
        } 
        let q = query(collection(firestoreDb, documentKey), ...queryConstraints);
        this.collectionUnsub = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push({key: doc.id, data:doc.data() });
                this.lastElement = doc;
            });

            if (callback !== undefined) {
                callback(cities);
            }
            //console.log("Current cities in CA: ", cities.join(", "));
        });
    }

    async fSelectWithQueryConstraints(documentKey, callback, queryConstraints = [], lastCallback, prevCallback) {
        let q = query(collection(firestoreDb, documentKey), ...queryConstraints)
        //const documentSnapshots = await getDocs(q);

        this.collectionUnsub = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({key: doc.id, data:doc.data() });
                this.lastElement = doc;
            });
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added" && this.init != true) {
                    audio.play();
                }
            });
            if (callback !== undefined) {
                callback(list);
            }
            console.log('result ', list);
            if (prevCallback !== undefined && prevCallback != null) {
                prevCallback(querySnapshot.docs[0]);
            }
            if (lastCallback !== undefined && lastCallback != null) {
                lastCallback(querySnapshot.docs[querySnapshot.docs.length-1]);
            }
            this.init = false;
        });
    }

    async selectWithQueryConstraints(documentKey, callback, queryConstraints = [], lastCallback, prevCallback) {
        let q = query(collection(firestoreDb, documentKey), ...queryConstraints)
        //const documentSnapshots = await getDocs(q);

        this.collectionUnsub = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({key: doc.id, data:doc.data() });
                this.lastElement = doc;
            });
            if (callback !== undefined) {
                callback(list);
            }
            console.log('result ', list);
            prevCallback(querySnapshot.docs[0]);
            lastCallback(querySnapshot.docs[querySnapshot.docs.length-1]);
            this.init = false;
        });
    }

    async delete(documentKey, id) {
        await deleteDoc(doc(firestoreDb, documentKey, id));
    }

    async unsubQuery() {
        if (this.collectionUnsub !== undefined && this.collectionUnsub != null) {
            this.collectionUnsub();
        } 
    }

    async getLastElement(q) {
        let documentSnapshots = null;
        try {
            documentSnapshots = await getDocs(q);
        } catch (e) {
            console.log(e);
        }
        if (documentSnapshots != null) {
            this.lastElement = documentSnapshots.docs[documentSnapshots.docs.length-1];
        }
        console.log('last is ', this.lastElement);
    }
}

export const fOrderService =  new FOrderService();