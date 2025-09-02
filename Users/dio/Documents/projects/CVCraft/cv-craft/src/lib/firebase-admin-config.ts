// src/lib/firebase-admin-config.ts
import admin from 'firebase-admin';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

// This check ensures we don't try to initialize the app multiple times
if (!admin.apps.length) {
  const serviceAccountConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  const hasRequiredEnvVars = 
    serviceAccountConfig.projectId &&
    serviceAccountConfig.privateKey &&
    serviceAccountConfig.clientEmail;

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
      const missingVars = [];
      if (!serviceAccountConfig.projectId) missingVars.push('FIREBASE_PROJECT_ID');
      if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push('FIREBASE_PRIVATE_KEY');
      if (!serviceAccountConfig.clientEmail) missingVars.push('FIREBASE_CLIENT_EMAIL');
      console.warn(`Firebase Admin environment variables not set. Missing: [${missingVars.join(', ')}]. Please check your .env file. Server-side Firebase features will be disabled.`);
  }
}

// Export the initialized admin app
export const adminApp = admin.apps[0] || null;

// Kept for legacy imports but new code should use adminApp
export function initializeAdminApp() {
  return adminApp;
}
