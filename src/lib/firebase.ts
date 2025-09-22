// $lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

// Use environment variables injected at build time
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Firestore setup
export const db = getFirestore(app);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// --- Emulator setup ---
// Only connect to emulators when running locally
if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

// --- Persistent login ---
// Keeps users logged in across tabs/reloads/browser restarts
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to local (stay logged in).");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence:", error);
  });
