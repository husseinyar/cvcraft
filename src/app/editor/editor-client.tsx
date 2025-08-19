
"use client";

import { useState, useRef, useEffect } from 'react';
import type { CVData, TemplateOption } from '@/types';
import CvEditor from '@/components/cv-editor';
import TemplatePreview from '@/components/template-preview';
import { useTranslation } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, Palette } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface EditorClientProps {
  serverCv: CVData;
}

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


const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
];

export default function EditorClient({ serverCv }: EditorClientProps) {
  const [cvData, setCvData] = useState<CVData>(serverCv);
  const { t } = useTranslation();
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On component mount, check sessionStorage for data from upload flow
    const storedCvData = sessionStorage.getItem('cv-craft-data');
    if (storedCvData) {
      try {
        const parsedData = JSON.parse(storedCvData);
        setCvData(parsedData);
        // Clear it so it doesn't persist across sessions
        sessionStorage.removeItem('cv-craft-data');
      } catch (e) {
        console.error("Failed to parse CV data from session storage", e);
        // If there's an issue, fall back to default or server-provided data
        setCvData(createDefaultCv());
      }
    } else {
        // If no session data, check localStorage for ongoing edits
        const localCvData = localStorage.getItem('cv-craft-local-data');
        if (localCvData) {
            setCvData(JSON.parse(localCvData));
        } else {
            // Otherwise use the server-provided CV (or a default)
            setCvData(serverCv);
        }
    }
  }, [serverCv]);

  // Auto-save to localStorage on change
  useEffect(() => {
    localStorage.setItem('cv-craft-local-data', JSON.stringify(cvData));
  }, [cvData]);

  const handleTemplateChange = (template: CVData['template']) => {
    setCvData(prev => ({ ...prev, template }));
  };

  const handleDownloadPdf = () => {
    const input = cvPreviewRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
        const imgWidth = canvasWidth * ratio;
        const imgHeight = canvasHeight * ratio;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${cvData.name.replace(' ', '_')}_CV.pdf`);
      });
    }
  };
  
  return (
    <div className="grid md:grid-cols-[400px_1fr] h-screen bg-muted/40">
      <aside className="bg-background border-r p-4 lg:p-6 overflow-y-auto">
         <CvEditor cvData={cvData} setCvData={setCvData} />
      </aside>
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
          <div className="flex justify-end items-center gap-4 mb-4">
              <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <Palette className="mr-2" /> {t('editor.template.title')}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                         <h3 className="text-lg font-semibold mb-4">{t('editor.template.title')}</h3>
                         <RadioGroup defaultValue={cvData.template} onValueChange={(value) => handleTemplateChange(value as TemplateOption)}>
                            <div className="grid grid-cols-2 gap-4">
                                {templateOptions.map(template => (
                                    <div key={template.name}>
                                        <RadioGroupItem value={template.name} id={template.name} className="sr-only" />
                                        <Label htmlFor={template.name} className="cursor-pointer">
                                            <div className="border-2 border-transparent rounded-md hover:border-primary data-[state=checked]:border-primary">
                                                <Image 
                                                    src={`https://placehold.co/200x275.png`}
                                                    width={200}
                                                    height={275}
                                                    alt={t(`templates.${template.name}` as any)}
                                                    data-ai-hint={template.hint}
                                                    className="rounded-md"
                                                />
                                                <p className="text-center text-sm mt-2">{t(`templates.${template.name}` as any)}</p>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                         </RadioGroup>
                    </SheetContent>
                </Sheet>
              <Button onClick={handleDownloadPdf}>
                  <Download className="mr-2" /> {t('editor.download_pdf')}
              </Button>
          </div>
          <div className="flex-grow flex items-center justify-center">
             <div className="max-w-4xl w-full">
                <TemplatePreview cvData={cvData} ref={cvPreviewRef} />
             </div>
          </div>
      </main>
    </div>
  );
}
