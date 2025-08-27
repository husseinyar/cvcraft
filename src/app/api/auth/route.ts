// src/app/api/auth/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';
import { serviceAccount } from '@/lib/firebase-admin-config';
import { cookies } from 'next/headers';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: {
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    },
  });
}

// Handler for session login
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Set session expiration to 14 days.
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

    // Set the cookie in the response.
    // httpOnly: true makes the cookie inaccessible to client-side JS, protecting against XSS.
    // secure: true ensures the cookie is only sent over HTTPS.
    // sameSite: 'lax' provides a balance of security and usability for CSRF protection.
    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handler for session logout
export async function DELETE() {
  try {
    // Clear the session cookie by setting its maxAge to 0.
    cookies().set('session', '', {
      maxAge: 0,
      path: '/',
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Session logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
