
"use client";

import { useState, useRef, useEffect } from 'react';
import type { CVData } from '@/types';
import TemplatePreview from '@/components/template-preview';
import { useTranslation } from '@/context/language-context';
import EditorSidebar from '@/components/editor-sidebar';
import EditCvModal from '@/components/edit-cv-modal';

interface EditorClientProps {
  initialCv: CVData;
}

export default function EditorClient({ initialCv }: EditorClientProps) {
  const [cvData, setCvData] = useState<CVData>(initialCv);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCvData(initialCv);
  }, [initialCv]);

  const handleTemplateChange = (template: CVData['template']) => {
    setCvData(prev => ({ ...prev, template }));
  };
  
  return (
    <div className="flex h-screen bg-muted/40">
      <EditorSidebar
        onEditClick={() => setIsModalOpen(true)}
        onTemplateChange={handleTemplateChange}
        cvPreviewRef={cvPreviewRef}
        currentTemplate={cvData.template}
        cvData={cvData}
      />
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
         <div className="max-w-4xl mx-auto">
            <TemplatePreview cvData={cvData} ref={cvPreviewRef} />
         </div>
      </main>

      <EditCvModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cvData={cvData}
        setCvData={setCvData}
        cvPreviewRef={cvPreviewRef}
      />
    </div>
  );
}
