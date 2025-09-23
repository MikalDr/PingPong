import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithRedirect,
  isSignInWithEmailLink
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const functions = getFunctions(app, 'europe-west1');

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to LOCAL (stays logged in).");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence:", error);
  });
export async function signInWithGoogle() {
  try {
    const userAgent = navigator.userAgent || '';
    const isiOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    if (isiOS) {
      console.log("iOS detected — using signInWithPopup to avoid missing sessionStorage state");
      return await signInWithPopup(auth, googleProvider);
    } else {
      return await signInWithRedirect(auth, googleProvider);
    }
  } catch (err) {
    console.error("Google sign-in failed:", err);
    throw err;
  }
}