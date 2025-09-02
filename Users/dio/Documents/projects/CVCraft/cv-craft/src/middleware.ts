// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase-admin-config';
import { getAuth } from 'firebase-admin/auth';
import type { UserRole } from './types';

// Initialize the Firebase Admin App
const adminApp = initializeAdminApp();
const auth = getAuth(adminApp);

// List of paths that require admin access
const ADMIN_PATHS = ['/admin', '/admin/dashboard', '/admin/edit'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is an admin path
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      // If no session cookie, redirect to the admin login page
      // which is just the base /admin page that shows the login prompt
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify the session cookie
      const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
      
      // Fetch the user's custom claims or role from Firestore
      const userDoc = await adminApp.firestore().collection('users').doc(decodedToken.uid).get();
      const userRole = userDoc.data()?.role as UserRole;
      
      // If the user is not an admin, redirect them to the homepage
      if (userRole !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url));
      }
      
      // If the user is an admin, allow the request to proceed
      return NextResponse.next();

    } catch (error) {
      // If cookie is invalid or expired, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.set('session', '', { maxAge: 0 }); // Clear the invalid cookie
      return response;
    }
  }

  // For all other paths, do nothing
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
