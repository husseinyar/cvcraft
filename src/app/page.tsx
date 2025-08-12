"use client";

import { useState } from 'react';
import type { CVData } from '@/types';
import { dummyCvData } from '@/lib/dummy-data';
import CvEditor from '@/components/cv-editor';
import TemplatePreview from '@/components/template-preview';

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(dummyCvData);

  const handleTemplateChange = (template: 'professional' | 'creative' | 'minimal') => {
    setCvData(prev => ({ ...prev, template }));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-10 px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary font-headline">CV Craft</h1>
          <p className="text-muted-foreground mt-2">Build your perfect CV with ease and a touch of AI.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 xl:col-span-4">
            <CvEditor
              cvData={cvData}
              setCvData={setCvData}
              onTemplateChange={handleTemplateChange}
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8 sticky top-10">
            <TemplatePreview cvData={cvData} />
          </div>
        </div>
      </div>
    </main>
  );
}
