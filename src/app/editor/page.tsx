
import { Suspense } from 'react';
import EditorClient from './editor-client';
import { Skeleton } from '@/components/ui/skeleton';


export default function EditorPage() {
  return (
    <Suspense fallback={<EditorPageSkeleton />}>
      <EditorClient />
    </Suspense>
  );
}

function EditorPageSkeleton() {
  return (
     <div className="grid md:grid-cols-[400px_1fr] h-screen bg-muted/40">
      <aside className="w-full bg-background border-r p-4 lg:p-6 overflow-y-auto">
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
