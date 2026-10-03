import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD9p0w4GBGEL_j5x4AElT31ojy78klL5XY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scrs-hiring.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scrs-hiring",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scrs-hiring.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "6337164630",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:6337164630:web:eec6e45525c0e29c25d2f7"
};

let dbInstance = null;
let authInstance = null;
let appInstance = null;

export function initFirebase() {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      if (!getApps().length) {
        appInstance = initializeApp(firebaseConfig);
      } else {
        appInstance = getApp();
      }
      dbInstance = getFirestore(appInstance);
      authInstance = getAuth(appInstance);
      return { db: dbInstance, auth: authInstance };
    } catch (err) {
      console.warn('Firebase initialization error:', err);
      dbInstance = null;
      authInstance = null;
      return null;
    }
  }
  return null;
}

export function getDb() {
  if (!dbInstance) {
    initFirebase();
  }
  return dbInstance;
}

export function getFirebaseAuth() {
  if (!authInstance) {
    initFirebase();
  }
  return authInstance;
}

export {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
