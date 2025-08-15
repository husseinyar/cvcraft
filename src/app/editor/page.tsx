
'use server';

import { Suspense } from 'react';
import type { CVData } from '@/types';
import EditorClient from './editor-client';
import { getAllUsers, getCvDataForUser } from '@/services/cv-service';
import { Skeleton } from '@/components/ui/skeleton';

async function EditorPageContent() {
  const allUsers = await getAllUsers();
  // We'll default to loading 'user1' or the first user found.
  // In a real app with authentication, you would get the logged-in user's ID.
  const initialCv = await getCvDataForUser(allUsers[0]?.id || 'user1');

  if (!initialCv) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">Could Not Load CV Data</h1>
          <p className="text-muted-foreground mt-2">
            This might be because the database is empty or there is a connection issue.
          </p>
          <p className="text-sm mt-4">
            Please ensure you have added a user with the ID 'user1' to your Firestore 'users' collection.
          </p>
        </div>
      </main>
    );
  }

  return <EditorClient allUsers={allUsers} initialCv={initialCv} />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorPageSkeleton />}>
      <EditorPageContent />
    </Suspense>
  );
}

function EditorPageSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-10 px-4">
        <header className="text-center mb-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto mt-4" />
        </header>
        <div className="max-w-sm mx-auto mb-8">
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <Skeleton className="h-screen w-full" />
          </div>
          <div className="lg:col-span-7 xl:col-span-8 sticky top-10">
            <Skeleton className="aspect-[8.5/11] w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
