
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, FileText, Palette, Download } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import type { CVData, TemplateOption } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from "next/image";

interface EditorSidebarProps {
    onEditClick: () => void;
    onTemplateChange: (template: TemplateOption) => void;
    cvPreviewRef: React.RefObject<HTMLDivElement>;
    currentTemplate: TemplateOption;
    cvData: CVData;
}

const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'otago', hint: 'resume otago' },
    { name: 'harvard', hint: 'resume harvard' },
    { name: 'princeton', hint: 'resume princeton' },
    { name: 'auckland', hint: 'resume auckland' },
    { name: 'edinburgh', hint: 'resume edinburgh' },
    { name: 'berkeley', hint: 'resume berkeley' },
];

export default function EditorSidebar({ onEditClick, onTemplateChange, cvPreviewRef, currentTemplate, cvData }: EditorSidebarProps) {
  const { t } = useTranslation();

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
    <aside className="w-20 bg-background border-r p-2 flex flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-4">
            <Link href="/" className="text-primary font-bold text-lg mb-4">
                CV
            </Link>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" onClick={onEditClick}>
                            <FileText />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Edit Sections</TooltipContent>
                </Tooltip>

                <Sheet>
                    <SheetTrigger asChild>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Palette />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Templates</TooltipContent>
                        </Tooltip>
                    </SheetTrigger>
                    <SheetContent>
                         <h3 className="text-lg font-semibold mb-4">{t('editor.template.title')}</h3>
                         <RadioGroup defaultValue={currentTemplate} onValueChange={(value) => onTemplateChange(value as TemplateOption)}>
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

                <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" onClick={handleDownloadPdf}>
                            <Download />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{t('editor.download_pdf')}</TooltipContent>
                </Tooltip>

            </TooltipProvider>
        </div>
        <TooltipProvider>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <Home />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Back to Home</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </aside>
  );
}
