// $lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithRedirect,
  isSignInWithEmailLink
} from 'firebase/auth';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// --- Persistent login across sessions ---
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to LOCAL (stays logged in).");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence:", error);
  });

// --- Helper function to sign in with Google safely on iOS ---
export async function signInWithGoogle() {
  try {
    // On Safari/iOS WebView, prefer popup to avoid sessionStorage issues
    const userAgent = navigator.userAgent || '';
    const isiOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    if (isiOS) {
      console.log("iOS detected — using signInWithPopup to avoid missing sessionStorage state");
      return await signInWithPopup(auth, googleProvider);
    } else {
      // Other platforms: redirect flow is fine
      return await signInWithRedirect(auth, googleProvider);
    }
  } catch (err) {
    console.error("Google sign-in failed:", err);
    throw err;
  }
}
