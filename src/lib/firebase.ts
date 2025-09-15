import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqVgByWxM6B-73kOHH1OUgVtSGnmRSmmo",
  authDomain: "pingpong2s.firebaseapp.com",
  projectId: "pingpong2s",
  storageBucket: "pingpong2s.firebasestorage.app",
  messagingSenderId: "585400207981",
  appId: "1:585400207981:web:0de0c1cce6f4ef4e4a4d64",
  measurementId: "G-24NWZMDLNC"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
