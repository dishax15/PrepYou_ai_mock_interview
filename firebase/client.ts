// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYg8oerGrvdE5aEe9uWC0MLYb0Wqw5Gi8",
  authDomain: "prepyou-ef5fc.firebaseapp.com",
  projectId: "prepyou-ef5fc",
  storageBucket: "prepyou-ef5fc.firebasestorage.app",
  messagingSenderId: "661439729136",
  appId: "1:661439729136:web:73d8d872017a5bf3fe2135",
  measurementId: "G-L3BL3GGVTY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);