import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbEr3JOQ3jtwSv_6sCvOAovWcagT0HXqs",
    authDomain: "dsc180ab.firebaseapp.com",
    projectId: "dsc180ab",
    storageBucket: "dsc180ab.firebasestorage.app",
    messagingSenderId: "178244919386",
    appId: "1:178244919386:web:e9a53a487d730197a9f863",
    measurementId: "G-4KPD3L5SSY"
  };



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
