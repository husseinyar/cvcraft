
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// Handles session management by calling our secure API endpoints
async function setSession(idToken: string) {
  await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

async function clearSession() {
  await fetch('/api/auth', { method: 'DELETE' });
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseEnabled, setFirebaseEnabled] = useState(false);

  useEffect(() => {
    if (auth) {
      setFirebaseEnabled(true);
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
        // When auth state changes, update the secure session cookie
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await setSession(idToken);
        } else {
          await clearSession();
        }
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
      setFirebaseEnabled(false);
    }
  }, []);

  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the session creation
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
      // The onAuthStateChanged listener will handle session clearing
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  if (!firebaseEnabled) {
    return (
        <Button variant="outline" disabled>
            <LogIn className="mr-2" /> Login Disabled
        </Button>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={handleSignIn}>
        <LogIn className="mr-2" /> Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
