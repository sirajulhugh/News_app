import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZZBALu7_aPT7xZ5X2FjBowpaq3f4TaIU",
  authDomain: "news-blog-app-2d5cc.firebaseapp.com",
  projectId: "news-blog-app-2d5cc",
  storageBucket: "news-blog-app-2d5cc.appspot.com",
  messagingSenderId: "410502875223",
  appId: "1:410502875223:web:c071d45d7cb18b9ccd3b12",
  measurementId: "G-4QK46WCCMJ",
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}


export { auth, db, storage, onAuthStateChanged };
