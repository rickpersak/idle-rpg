// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// PASTE THE CONFIG OBJECT YOU COPIED FROM THE FIREBASE CONSOLE HERE
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-H4qaFmj95qZx_5rm_YvnwQ8OLjAsw6s",
    authDomain: "idle-rpg-game-4d9a6.firebaseapp.com",
    projectId: "idle-rpg-game-4d9a6",
    storageBucket: "idle-rpg-game-4d9a6.firebasestorage.app",
    messagingSenderId: "1052151848571",
    appId: "1:1052151848571:web:77538773c9994cba6dccde",
    measurementId: "G-D94ZZHYVP2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services we'll need
export const auth = getAuth(app);
export const db = getFirestore(app);