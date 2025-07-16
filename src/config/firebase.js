import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_DMljZ-JzYADkgN8O5rs_xk5hHOc1n4A",
  authDomain: "the-chronicle-chamber.firebaseapp.com",
  projectId: "the-chronicle-chamber",
  storageBucket: "the-chronicle-chamber.firebasestorage.app",
  messagingSenderId: "913451149132",
  appId: "1:913451149132:web:2264ae507b2bf118fad1e9",
  measurementId: "G-T9XKEK5Q2G"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();