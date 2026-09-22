
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA94UhglxZN7fYq-XTCrAfolZlc7GilWFI",
    authDomain: "alejo-ayala.firebaseapp.com",
    projectId: "alejo-ayala",
    storageBucket: "alejo-ayala.firebasestorage.app",
    messagingSenderId: "170784617278",
    appId: "1:170784617278:web:58a20029b7ec40ce9ef26f",
    measurementId: "G-SSL6QFMY8C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)