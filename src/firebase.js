// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyAlAL6W4-KOuOv-185agYw_PJI_7NjKLUk",

  authDomain: "electronics-projects-site.firebaseapp.com",

  projectId: "electronics-projects-site",

  storageBucket: "electronics-projects-site.firebasestorage.app",

  messagingSenderId: "415235135226",

  appId: "1:415235135226:web:44ac2d674e4ccda52c9b43"

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers for social login
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
