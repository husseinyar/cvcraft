"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCV } from '@/context/cv-context';
import { Loader2 } from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminPage() {
  const { user, isLoaded } = useCV();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (user?.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user && user.id !== 'anonymous') {
        // User is logged in but not an admin
        router.replace('/');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.id === 'anonymous') {
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

  // This content will be briefly visible while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
       <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
