import { ref, onValue, query, orderByChild, getDatabase, child, push, update} from "firebase/database";
import { getAuth } from "firebase/auth";

const db = getDatabase();
const auth = getAuth();

//TODO: разбить на функции работы с базой данных
class OrderService {

  setDataCallback = null; 

  setCallback(callback) {
    this.setDataCallback = callback;
  }

  getAll() {
    let orderCollection = [];
    console.log('get all');
    const userOrders = query(ref(db, 'orders/'));
    console.log('orders', userOrders);
    onValue(userOrders, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        let obj = {key: childKey, data: childData};
        orderCollection.push(obj);
      });
    });
    return orderCollection;
  }

  getOne() {
    //console.log('user', auth.currentUser);
    //const starCountRef = ref(db, 'orders/' +  auth.currentUser.uid + '/test');
    let data = null;
    const userOrders = query(ref(db, 'orders/' + auth.currentUser.uid + '/test'), orderByChild('username'));
    console.log('orders', userOrders);
    onValue(userOrders, (snapshot) => {
      data = snapshot.val();
      console.log('json', data)
    });
    return data;
  }

  write(dataKey, data) {
    const newPostKey = push(child(ref(db), '/' + dataKey)).key;
    console.log('post key ', newPostKey);
    let updates = {}
    updates['/' + dataKey + '/' + newPostKey] = data;
    return update(ref(db), updates);
  }

  writeUserData(data) {
    //console.log('user', auth.currentUser);
    let updates = {};
    updates[ '/orders/' + data.key] = data.data;
    console.log('data to update ', updates );
    update(ref(db), updates);
  }

  create(order) {
    return db.push(order);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }

}

export const orderService =  new OrderService();