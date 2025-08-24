
"use client";

import { useRef, useState, useEffect } from 'react';
import type { CVData, TemplateOption, UserProfile } from '@/types';
import CvEditor from '@/components/cv-editor';
import TemplatePreview from '@/components/template-preview';
import { useTranslation } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, Palette, Plus, Copy, UserCog } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useCV } from '@/context/cv-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { duplicateCv } from '@/services/cv-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const templateOptions: { name: TemplateOption, hint: string }[] = [
    { name: 'onyx', hint: 'resume modern dark' },
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
];

export default function EditorClient() {
  const { 
    user,
    isLoaded, 
    allUsers, // For admin
    activeUser, // For admin
    setActiveUser, // For admin
    userCvs, 
    setUserCvs,
    activeCv, 
    setActiveCv,
    handleCreateNewCv
  } = useCV();
  const { t } = useTranslation();
  const { toast } = useToast();
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Determine if the current user is an admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // If an admin is viewing another user and that user is removed,
    // fall back to the admin's own view.
    if (isAdmin && activeUser && !allUsers.find(u => u.id === activeUser.id)) {
      setActiveUser(user);
    }
  }, [allUsers, activeUser, isAdmin, setActiveUser, user]);

  const handleTemplateChange = (template: CVData['template']) => {
    if (setActiveCv && activeCv) {
        setActiveCv(prev => ({ ...prev!, template }));
    }
  };

  const handleDownloadPdf = async () => {
    const input = cvPreviewRef.current;
    if (!input || !activeCv) {
        console.error("CV preview ref or CV data is not available.");
        return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const pages = input.querySelectorAll('.cv-page') as NodeListOf<HTMLElement>;

    if (pages.length === 0) {
        // Fallback for templates that might not have the .cv-page structure
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const canvas = await html2canvas(page, {
                scale: 2,
                useCORS: true,
                backgroundColor: activeCv.template === 'onyx' ? '#1A1A1A' : '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            
            if (i > 0) {
                pdf.addPage();
            }
            // Add the image to the PDF, fitting it to the A4 page size
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
    }

    pdf.save(`${activeCv.cvName.replace(/\s+/g, '_')}_CV.pdf`);
  };
  
  const handleCvSelectionChange = (cvId: string) => {
    const selectedCv = userCvs.find(cv => cv.id === cvId);
    if (selectedCv) {
      setActiveCv(selectedCv);
    }
  };
  
  const handleDuplicate = async () => {
    if (!activeCv) return;
    setIsDuplicating(true);
    try {
        const newCv = await duplicateCv(activeCv);
        setUserCvs(prev => [newCv, ...prev]);
        setActiveCv(newCv);
        toast({
            title: "CV Duplicated",
            description: `A copy of "${activeCv.cvName}" has been created.`,
        });
    } catch (error) {
        toast({ title: "Error", description: "Could not duplicate CV.", variant: "destructive" });
    } finally {
        setIsDuplicating(false);
    }
  };
  
  const handleUserSelectionChange = (userId: string) => {
    const selectedUser = allUsers.find(u => u.id === userId);
    if (selectedUser) {
      setActiveUser(selectedUser);
    }
  };

  if (!isLoaded || !activeCv || !setActiveCv) {
    return <EditorPageSkeleton />;
  }

  return (
    <div className="grid md:grid-cols-[400px_1fr] h-screen bg-muted/40">
      <aside className="bg-background border-r p-4 lg:p-6 overflow-y-auto">
         <CvEditor cvData={activeCv} setCvData={setActiveCv} />
      </aside>
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col items-center justify-start">
          <div className="w-full max-w-[210mm] space-y-4 mb-4">
              {user && (
                <div className="bg-card border rounded-lg p-3 space-y-3">
                  {isAdmin && (
                    <div>
                       <Label className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{t('editor.manage_users.title')}</span>
                          <Badge variant="destructive">{t('editor.admin_view_badge')}</Badge>
                       </Label>
                       <div className="flex items-center gap-2 mt-1">
                           <Select value={activeUser?.id || user.id} onValueChange={handleUserSelectionChange}>
                               <SelectTrigger className="flex-grow">
                                   <SelectValue placeholder={t('editor.manage_users.placeholder')} />
                               </SelectTrigger>
                               <SelectContent>
                                   {allUsers.map(u => (
                                       <SelectItem key={u.id} value={u.id}>
                                          <div className="flex items-center gap-2">
                                            <UserCog className="h-4 w-4" />
                                            {u.email}
                                          </div>
                                       </SelectItem>
                                   ))}
                               </SelectContent>
                           </Select>
                       </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground">Manage CVs</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Select value={activeCv.id} onValueChange={handleCvSelectionChange} disabled={userCvs.length === 0}>
                            <SelectTrigger className="flex-grow">
                                <SelectValue placeholder="Select a CV" />
                            </SelectTrigger>
                            <SelectContent>
                                {userCvs.map(cv => (
                                    <SelectItem key={cv.id} value={cv.id}>{cv.cvName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={handleCreateNewCv}><Plus /></Button>
                        <Button variant="outline" size="icon" onClick={handleDuplicate} disabled={isDuplicating}><Copy /></Button>
                    </div>
                  </div>

                </div>
              )}
              <div className="flex justify-end items-center gap-4">
                  <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <Palette className="mr-2" /> {t('editor.template.title')}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <h3 className="text-lg font-semibold mb-4">{t('editor.template.title')}</h3>
                            <RadioGroup defaultValue={activeCv.template} onValueChange={(value) => handleTemplateChange(value as TemplateOption)}>
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
          </div>
          <div className="flex-grow flex items-start justify-center pt-8">
             <div className="transform scale-[0.9] origin-top">
                <TemplatePreview cvData={activeCv} ref={cvPreviewRef} />
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
            <Skeleton className="aspect-[210/297] w-full max-w-[210mm]" />
         </div>
      </main>
    </div>
  );
}
