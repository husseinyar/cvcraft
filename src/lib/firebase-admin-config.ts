// src/lib/firebase-admin-config.ts

// This file securely loads the Firebase Admin SDK credentials.
// It uses environment variables to avoid hardcoding sensitive keys in the source code.

interface FirebaseServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Retrieve the service account details from environment variables.
// The private key needs special handling to replace the `\\n` escape sequences
// with actual newline characters.
export const serviceAccount: FirebaseServiceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID!,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL!)}`,
};
