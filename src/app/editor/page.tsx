
'use server';

import { Suspense } from 'react';
import type { CVData } from '@/types';
import EditorClient from './editor-client';
import { getAllUsers, getCvDataForUser } from '@/services/cv-service';
import { Skeleton } from '@/components/ui/skeleton';

const createDefaultCv = (): CVData => ({
  id: 'user1',
  name: 'Alex Doe',
  jobTitle: 'Software Developer',
  contact: {
    email: 'alex.doe@example.com',
    phone: '123-456-7890',
    website: 'alexdoe.com',
  },
  summary: 'A passionate software developer with experience in building web applications.',
  experience: [],
  education: [],
  skills: [],
  template: 'otago',
  role: 'user',
});

async function EditorPageContent() {
  let allUsers = await getAllUsers();
  let initialCv: CVData | null = null;

  if (allUsers.length > 0) {
    // If users exist, load the first one
    initialCv = await getCvDataForUser(allUsers[0].id);
  }

  // If no users exist or fetching the first user fails, create a default CV
  if (!initialCv) {
    initialCv = createDefaultCv();
    // If the database was empty, this default user is the only one for now
    if (allUsers.length === 0) {
      allUsers = [initialCv];
    }
  }


  return <EditorClient allUsers={allUsers} initialCv={initialCv} />;
}

export default async function EditorPage() {
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
