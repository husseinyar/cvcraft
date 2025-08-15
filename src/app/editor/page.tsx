
'use server';

import { Suspense } from 'react';
import type { CVData } from '@/types';
import EditorClient from './editor-client';
import { getCvDataForUser } from '@/services/cv-service';
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

async function EditorPageContent() {
  let initialCv = await getCvDataForUser('user1');

  if (!initialCv) {
    initialCv = createDefaultCv();
  }

  return <EditorClient initialCv={initialCv} />;
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
      {/* Sidebar Skeleton */}
      <aside className="w-20 bg-background border-r p-4 flex flex-col items-center gap-8">
         <Skeleton className="h-8 w-8 rounded-full" />
         <div className="space-y-6">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
         </div>
      </aside>
      {/* Main Content Skeleton */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
         <div className="max-w-4xl mx-auto">
            <Skeleton className="aspect-[8.5/11] w-full" />
         </div>
      </main>
    </div>
  );
}
