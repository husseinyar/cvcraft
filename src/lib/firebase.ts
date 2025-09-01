// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are defined
const hasRequiredEnvVars = 
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (hasRequiredEnvVars) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);

    // Connect to emulators in development, only if auth was successfully initialized
    if (process.env.NODE_ENV === 'development' && auth) {
        try {
            // Check if emulator is already connected to prevent re-connect errors
            if (!(auth as any).emulatorConfig) {
                connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
            }
        } catch (e) {
            console.warn("Could not connect to Firebase Auth Emulator. It might not be running or is already connected.");
        }
    }
} else {
    console.warn("One or more Firebase environment variables are not set. Firebase features will be disabled.");
}

export { app, db, auth };
