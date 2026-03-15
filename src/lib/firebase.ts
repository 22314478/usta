import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA1-NFiP5qEb7OamuyeJnf4IkfjVlVdY38",
  authDomain: "qrmenu-be0cb.firebaseapp.com",
  projectId: "qrmenu-be0cb",
  storageBucket: "qrmenu-be0cb.firebasestorage.app",
  messagingSenderId: "381926245769",
  appId: "1:381926245769:web:7af3a04acc55b35d984d58",
  measurementId: "G-B7VQRN7MKT"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Analytics is only supported in browser environments
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app, db, auth };
