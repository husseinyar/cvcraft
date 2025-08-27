
"use client";

import { useState } from 'react';
import type { CVData, TemplateOption } from '@/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, Palette, Type, View } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import TemplatePreview from './template-preview';
import CvStyleProvider from './cv-style-provider';

interface EditorToolbarProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
  cvPreviewRef: React.RefObject<HTMLDivElement>;
}

const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'onyx', hint: 'resume modern dark' },
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
];

const colorPresets = [
    "hsl(211, 30%, 50%)", // Default Blue
    "hsl(150, 35%, 55%)", // Teal Green
    "hsl(340, 82%, 52%)", // Pink
    "hsl(26, 82%, 52%)", // Orange
    "hsl(260, 52%, 52%)", // Purple
    "hsl(30, 3%, 29%)", // Gray
];

export default function EditorToolbar({ cvData, setCvData, cvPreviewRef }: EditorToolbarProps) {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTemplateChange = (template: CVData['template']) => {
    if (setCvData && cvData) {
        setCvData(prev => ({ ...prev!, template }));
    }
  };

  const handleThemeChange = (field: keyof CVData['theme'], value: string | number) => {
    if (setCvData && cvData) {
      setCvData(prev => ({
        ...prev!,
        theme: {
          ...prev!.theme,
          [field]: value,
        },
      }));
    }
  };
  
  const handleDownloadPdf = async () => {
    const input = cvPreviewRef.current;
    if (!input || !cvData) {
      toast({ title: "Error", description: "CV preview not available for download.", variant: "destructive" });
      return;
    }

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: cvData.template === 'onyx' ? '#1A1A1A' : '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = pdfWidth / canvasWidth;
    const imgHeight = canvasHeight * ratio;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${cvData.cvName.replace(/\s+/g, '_')}_CV.pdf`);
  };

  return (
    <div className="flex justify-end items-center gap-2 flex-wrap">
      <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline">
                <Palette className="mr-2" /> Template
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
              <SheetTitle>Select Template</SheetTitle>
            </SheetHeader>
            <RadioGroup defaultValue={cvData.template} onValueChange={(value) => handleTemplateChange(value as TemplateOption)} className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                    {templateOptions.map(template => (
                        <div key={template.name}>
                            <RadioGroupItem value={template.name} id={template.name} className="sr-only" />
                            <Label htmlFor={template.name} className="cursor-pointer">
                                <div className="border-2 border-transparent rounded-md hover:border-primary data-[state=checked]:border-primary">
                                    <Image 
                                        src={`https://placehold.co/200x275.png`}
                                        width={200}
                                        height={282}
                                        alt={`${template.name} template`}
                                        data-ai-hint={template.hint}
                                        className="rounded-md"
                                    />
                                    <p className="text-center text-sm mt-2 capitalize">{template.name}</p>
                                </div>
                            </Label>
                        </div>
                    ))}
                </div>
            </RadioGroup>
        </SheetContent>
      </Sheet>

      <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cvData.theme.primaryColor }} /> Color</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
            <div className="flex gap-2">
                {colorPresets.map(color => (
                    <button 
                        key={color} 
                        onClick={() => handleThemeChange('primaryColor', color)}
                        className="w-8 h-8 rounded-full border-2" 
                        style={{ backgroundColor: color, borderColor: cvData.theme.primaryColor === color ? color : 'transparent' }} 
                    />
                ))}
            </div>
        </PopoverContent>
      </Popover>

       <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline"><Type className="mr-2" /> Font Size</Button>
        </PopoverTrigger>
        <PopoverContent>
            <Label>Base Font Size: {cvData.theme.fontSize}px</Label>
            <Slider 
                defaultValue={[cvData.theme.fontSize]} 
                min={8} 
                max={14} 
                step={1} 
                onValueChange={(value) => handleThemeChange('fontSize', value[0])}
            />
        </PopoverContent>
      </Popover>

      <Button onClick={() => setIsPreviewOpen(true)} variant="outline"><View className="mr-2" /> Preview</Button>
      <Button onClick={handleDownloadPdf}><Download className="mr-2" /> Download PDF</Button>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-none w-auto h-screen p-8 bg-muted/80 backdrop-blur-sm overflow-y-auto">
            <div className="mx-auto">
                 <CvStyleProvider theme={cvData.theme}>
                    <TemplatePreview cvData={cvData} />
                </CvStyleProvider>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
