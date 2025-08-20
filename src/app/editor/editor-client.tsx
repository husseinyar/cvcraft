
"use client";

import { useRef } from 'react';
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
import { useCV } from '@/context/cv-context';
import { Skeleton } from '@/components/ui/skeleton';

const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'onyx', hint: 'resume modern dark' },
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
];

export default function EditorClient() {
  const { cvData, setCvData, isLoaded } = useCV();
  const { t } = useTranslation();
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const handleTemplateChange = (template: CVData['template']) => {
    if (setCvData) {
        setCvData(prev => ({ ...prev, template }));
    }
  };

  const handleDownloadPdf = () => {
    const input = cvPreviewRef.current;
    if (input) {
       const pages = input.querySelectorAll('.cv-page');
       const pdf = new jsPDF('p', 'mm', 'a4');
       const pdfWidth = pdf.internal.pageSize.getWidth();
       const pdfHeight = pdf.internal.pageSize.getHeight();

       if (pages.length === 0 || !cvData) {
        console.error("No pages found to render for PDF or CV data is missing.");
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
  
  if (!isLoaded || !cvData || !setCvData) {
    return <EditorPageSkeleton />;
  }

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
