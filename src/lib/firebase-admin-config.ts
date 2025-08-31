// src/lib/firebase-admin-config.ts
import admin from 'firebase-admin';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const hasRequiredEnvVars = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL;

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

export function initializeAdminApp() {
  if (!admin.apps.length) {
    // Only initialize if the environment variables are set
    if (hasRequiredEnvVars) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error) {
        console.error("Firebase Admin initialization error:", error);
      }
    } else {
        console.warn("Firebase Admin environment variables not set. Skipping initialization.");
    }
  }
  return admin;
}
