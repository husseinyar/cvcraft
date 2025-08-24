
"use client";

import { useRef, useState, useEffect } from 'react';
import type { CVData, TemplateOption } from '@/types';
import CvEditor from '@/components/cv-editor';
import TemplatePreview from '@/components/template-preview';
import { useTranslation } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Plus, Copy, UserCog } from "lucide-react";
import { useCV } from '@/context/cv-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { duplicateCv } from '@/services/cv-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import EditorToolbar from '@/components/editor-toolbar';
import CvStyleProvider from '@/components/cv-style-provider';

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
             <EditorToolbar cvData={activeCv} setCvData={setActiveCv} cvPreviewRef={cvPreviewRef} />
          </div>
          <div className="flex-grow flex items-start justify-center pt-8">
             <div className="transform scale-[0.9] origin-top">
                <CvStyleProvider theme={activeCv.theme}>
                    <TemplatePreview cvData={activeCv} ref={cvPreviewRef} />
                </CvStyleProvider>
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
