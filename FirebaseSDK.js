// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "ecotrack-b415d.firebaseapp.com",
  projectId: "ecotrack-b415d",
  storageBucket: "ecotrack-b415d.firebasestorage.app",
  messagingSenderId: "80573195825",
  appId: "1:80573195825:web:ca8570d3bb9fc763e71710",
  measurementId: "G-JGH2FKBMW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);