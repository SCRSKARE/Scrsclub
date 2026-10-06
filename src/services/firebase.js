import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
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

// Firebase configuration loaded directly from Vite environment variables (.env)
export const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || "AIzaSyD9p0w4GBGEL_j5x4AElT31ojy78klL5XY",
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || "scrs-hiring.firebaseapp.com",
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || "scrs-hiring",
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || "scrs-hiring.firebasestorage.app",
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || "6337164630",
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || "1:6337164630:web:eec6e45525c0e29c25d2f7"
};

// Website Firestore Collection Names
export const COLLECTIONS = {
  APPLICATIONS: 'applications',
  UPCOMING_EVENTS: 'upcoming_events',
  EVENT_REGISTRATIONS: 'event_registrations',
  PAST_EVENTS: 'past_events',
  TEAM_MEMBERS: 'team_members',
  PORTAL_SETTINGS: 'portal_settings'
};

let dbInstance = null;
let authInstance = null;
let appInstance = null;

// Initialize Firebase App, Firestore, and Auth
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
      return { db: dbInstance, auth: authInstance, app: appInstance };
    } catch (err) {
      console.warn('Firebase initialization notice:', err);
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

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('YOUR_')
  );
}

// Diagnostic helper to test the database connection
export async function testDatabaseConnection() {
  const db = getDb();
  if (!db) {
    return {
      connected: false,
      mode: 'local_storage',
      projectId: firebaseConfig.projectId || 'none',
      message: 'Firebase is not initialized. Check .env configuration.'
    };
  }

  try {
    const testRef = collection(db, COLLECTIONS.APPLICATIONS);
    const q = query(testRef, limit(1));
    await getDocs(q);
    return {
      connected: true,
      mode: 'firestore_cloud',
      projectId: firebaseConfig.projectId,
      message: `Successfully connected to Cloud Firestore (Project: ${firebaseConfig.projectId})`
    };
  } catch (err) {
    console.warn('Firestore test connection notice:', err);
    const isPermissionError = err.code === 'permission-denied';
    return {
      connected: !isPermissionError,
      mode: isPermissionError ? 'permission_restricted' : 'local_storage_fallback',
      projectId: firebaseConfig.projectId,
      error: err.message,
      message: isPermissionError
        ? 'Connected to Firestore, but read/write security rules restricted access. Please configure test rules in Firebase Console.'
        : `Firestore connection notice: ${err.message}`
    };
  }
}

export {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
