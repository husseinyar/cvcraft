// src/lib/firebase-admin-config.ts
import admin from 'firebase-admin';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const serviceAccountConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const hasRequiredEnvVars = 
  serviceAccountConfig.projectId &&
  serviceAccountConfig.privateKey &&
  serviceAccountConfig.clientEmail;

export function initializeAdminApp() {
  if (!admin.apps.length) {
    if (hasRequiredEnvVars) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountConfig as admin.ServiceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
      } catch (error: any) {
        console.error("Firebase Admin initialization error:", error.message);
      }
    } else {
        console.warn("Firebase Admin environment variables not set. Please check your .env file. Server-side Firebase features will be disabled.");
    }
  }
  return admin;
}
