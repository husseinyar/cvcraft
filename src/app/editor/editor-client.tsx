
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
  serverCv: CVData; // This is now just the default/initial CV
}

const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'onyx', hint: 'resume modern dark' },
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
];

export default function EditorClient({ serverCv }: EditorClientProps) {
  const [cvData, setCvData] = useState<CVData>(serverCv);
  const { t } = useTranslation();
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  // Load data from client-side storage on initial mount
  useEffect(() => {
    const storedCvData = sessionStorage.getItem('cv-craft-data');
    if (storedCvData) {
      try {
        setCvData(JSON.parse(storedCvData));
        // Clear it so it doesn't persist across refreshes after the initial load
        sessionStorage.removeItem('cv-craft-data');
      } catch (e) {
        console.error("Failed to parse CV data from session storage", e);
      }
    } else {
        const localCvData = localStorage.getItem('cv-craft-local-data');
        if (localCvData) {
            try {
                setCvData(JSON.parse(localCvData));
            } catch (e) {
                console.error("Failed to parse CV data from local storage", e);
            }
        }
    }
  }, []);

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
       const pages = input.querySelectorAll('.cv-page');
       const pdf = new jsPDF('p', 'mm', 'a4');
       const pdfWidth = pdf.internal.pageSize.getWidth();
       const pdfHeight = pdf.internal.pageSize.getHeight();

       if (pages.length === 0) {
        console.error("No pages found to render for PDF.");
        return;
       }

       const processPage = (pageIndex: number) => {
            if (pageIndex >= pages.length) {
                pdf.save(`${cvData.name.replace(' ', '_')}_CV.pdf`);
                return;
            }
            if (pageIndex > 0) {
                pdf.addPage();
            }
            const page = pages[pageIndex] as HTMLElement;
            html2canvas(page, { 
              scale: 2, 
              backgroundColor: '#121417', // Explicitly set background for dark theme
              useCORS: true, 
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                processPage(pageIndex + 1);
            });
       };
       processPage(0);
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
