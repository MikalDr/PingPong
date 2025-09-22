// $lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "pingpong2s",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Firestore setup
export const db = getFirestore(app);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// --- Emulator setup ---
// Force connect to emulators for testing, regardless of build mode
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

// --- Persistent login ---
// Keeps users logged in across tabs/reloads/browser restarts
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to local (stay logged in).");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence:", error);
  });
