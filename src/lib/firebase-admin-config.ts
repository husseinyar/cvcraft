// src/lib/firebase-admin-config.ts
import { config } from 'dotenv';
config(); // Load environment variables from .env file

// This file securely loads the Firebase Admin SDK credentials.
// It uses environment variables to avoid hardcoding sensitive keys in the source code.

import type { ServiceAccount } from 'firebase-admin';

// Retrieve the service account details from environment variables.
// The private key needs special handling to replace the `\\n` escape sequences
// with actual newline characters.
export const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};
