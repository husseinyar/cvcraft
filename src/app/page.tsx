
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus2, CloudUpload, ArrowRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';


function EntryScreenContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FilePlus2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Start Fresh</CardTitle>
              <CardDescription>Build your CV step-by-step with our smart editor.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/editor">
            <Button className="w-full" size="lg">
              Create Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <CloudUpload className="h-8 w-8 text-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl">Use Your Resume</CardTitle>
              <CardDescription>Transform your current resume into a stunning CV.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/upload">
            <Button className="w-full" size="lg" variant="secondary">
              Upload Resume <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function EntryScreenSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Skeleton className="h-[210px] w-full" />
            <Skeleton className="h-[210px] w-full" />
        </div>
    );
}


export default function EntryScreen() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          CV Craft
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your next job starts with a great CV. Let’s make it unforgettable.
        </p>
         <p className="text-sm text-accent mt-4">No account needed. Just start building.</p>
      </div>

      {isMounted ? <EntryScreenContent /> : <EntryScreenSkeleton />}
      
    </div>
  );
}
