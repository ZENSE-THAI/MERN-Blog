// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ad492.firebaseapp.com",
  projectId: "mern-blog-ad492",
  storageBucket: "mern-blog-ad492.appspot.com",
  messagingSenderId: "135304001093",
  appId: "1:135304001093:web:7031db690f300c2881152c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);