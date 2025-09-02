"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCV } from '@/context/cv-context';
import { Loader2 } from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminPage() {
  const { user, isLoaded } = useCV();
  const router = useRouter();
  const [content, setContent] = useState<'loading' | 'login' | 'redirecting'>('loading');

  useEffect(() => {
    if (isLoaded) {
      if (user?.role === 'admin') {
        router.replace('/admin/dashboard');
        setContent('redirecting');
      } else if (user && user.id !== 'anonymous') {
        // User is logged in but not an admin
        router.replace('/');
        setContent('redirecting');
      } else {
        // User is not logged in (anonymous)
        setContent('login');
      }
    }
  }, [user, isLoaded, router]);

  if (content === 'loading' || content === 'redirecting') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (content === 'login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Admin Access Required</CardTitle>
                <CardDescription>Please log in with an administrator account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <AuthButton />
            </CardContent>
        </Card>
      </div>
    );
  }
  
  // Fallback to loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
       <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
