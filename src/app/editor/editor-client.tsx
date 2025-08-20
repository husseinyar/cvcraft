
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
    if (setCvData && cvData) {
        setCvData(prev => ({ ...prev!, template }));
    }
  };

  const handleDownloadPdf = () => {
    const input = cvPreviewRef.current;
    if (input && cvData) {
        // Use the direct child of the ref for capture, which is the template itself.
        const elementToCapture = input.firstChild as HTMLElement;
        if (!elementToCapture) {
            console.error("CV preview element to capture not found.");
            return;
        }

        html2canvas(elementToCapture, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            // Allow tainting to handle cross-origin images if any
            allowTaint: true, 
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            // Create a new PDF in A4 size
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate the aspect ratio to fit the image to the PDF page
            const canvasAspectRatio = canvas.width / canvas.height;
            const pageAspectRatio = pdfWidth / pdfHeight;

            let imgWidth = pdfWidth;
            let imgHeight = pdfHeight;
            
            if (canvasAspectRatio > pageAspectRatio) {
                // Canvas is wider than page
                imgHeight = pdfWidth / canvasAspectRatio;
            } else {
                // Canvas is taller than page
                imgWidth = pdfHeight * canvasAspectRatio;
            }

            // Center the image on the page (optional)
            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
            pdf.save(`${cvData.name.replace(/\s+/g, '_')}_CV.pdf`);
        });
    } else {
        console.error("CV preview ref or CV data is not available.");
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
