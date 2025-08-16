
'use server';

import { Suspense } from 'react';
import type { CVData } from '@/types';
import EditorClient from './editor-client';
import { getCvDataForUser } from '@/services/cv-service';
import { Skeleton } from '@/components/ui/skeleton';

const createDefaultCv = (): CVData => ({
  id: `user_${Date.now()}`,
  name: 'Alex Doe',
  jobTitle: 'Software Developer',
  contact: {
    email: 'alex.doe@example.com',
    phone: '123-456-7890',
    website: 'alexdoe.com',
  },
  summary: 'A passionate software developer with experience in building web applications. Start by editing this text!',
  experience: [
    { id: 'exp1', role: 'Frontend Developer', company: 'Tech Solutions', dates: '2020 - Present', description: 'Developed and maintained user-facing features for a large-scale web application using React and TypeScript.' },
  ],
  education: [
     { id: 'edu1', school: 'University of Technology', degree: 'B.Sc. in Computer Science', dates: '2016 - 2020', description: '' },
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
  template: 'otago',
  role: 'user',
});

// This part runs on the server
async function EditorPageContent() {
  // In a real app, you might get a user ID from session. For this example, we use a default.
  // We prioritize getting the user from a real DB. If not found, we create a default one.
  // The client will then check sessionStorage and overwrite if needed.
  let initialCv = await getCvDataForUser('user1');

  if (!initialCv) {
    initialCv = createDefaultCv();
  }

  return <EditorClient serverCv={initialCv} />;
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
     <div className="flex h-screen bg-muted/40">
      <aside className="w-80 bg-background border-r p-4 lg:p-6 overflow-y-auto">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
         <div className="max-w-4xl mx-auto">
            <Skeleton className="aspect-[8.5/11] w-full" />
         </div>
      </main>
    </div>
  );
}
