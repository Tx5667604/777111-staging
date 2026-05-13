// src/lib/firebase.ts
// ⚠️ Заміни значення на свої з Firebase Console
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Заповнити після створення Firebase проекту
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCGDrySQ6zeB-EGS-eq-5zphz73evMQc9A",
  authDomain: "phone-repair-46298.firebaseapp.com",
  projectId: "phone-repair-46298",
  storageBucket: "phone-repair-46298.firebasestorage.app",
  messagingSenderId: "481840259564",
  appId: "1:481840259564:web:0f0e3ad3cda63d441a20c9",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function initFirebase(): { auth: Auth; db: Firestore; googleProvider: GoogleAuthProvider } {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  }
  return { auth: auth!, db: db!, googleProvider: googleProvider! };
}

export function getFirebaseConfig(): FirebaseConfig {
  return firebaseConfig;
}
