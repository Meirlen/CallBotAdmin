import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyD4CLmtSJ6KHo6oy9XXy0sGi8FO8pjkNRI",
  authDomain: "transport-2f82d.firebaseapp.com",
  projectId: "transport-2f82d",
  storageBucket: "transport-2f82d.appspot.com",
  messagingSenderId: "202574982319",
  appId: "1:202574982319:web:f45b7f8397204691fe785a"
};

export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
