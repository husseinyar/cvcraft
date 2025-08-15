
"use client";

import { useState, useRef } from 'react';
import type { CVData, TemplateOption } from '@/types';
import { allUsers, dummyCvData } from '@/lib/dummy-data';
import CvEditor from '@/components/cv-editor';
import TemplatePreview from '@/components/template-preview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';

export default function EditorPage() {
  const [currentUser, setCurrentUser] = useState<CVData>(allUsers[0]);
  const [cvData, setCvData] = useState<CVData>(allUsers[0]);
  const { t } = useTranslation();
  const cvPreviewRef = useRef<HTMLDivElement>(null);


  const handleTemplateChange = (template: TemplateOption) => {
    setCvData(prev => ({ ...prev, template }));
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = allUsers.find(user => user.id === userId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      setCvData(selectedUser);
    }
  };

  const visibleUsers = currentUser.role === 'admin' ? allUsers : [currentUser];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-10 px-4">
        <header className="text-center mb-4">
          <h1 className="text-4xl font-bold text-primary font-headline">CV Craft</h1>
          <p className="text-muted-foreground mt-2">{t('editor.header.subtitle')}</p>
        </header>

        <Card className="p-4 mb-8 max-w-sm mx-auto">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <label htmlFor="user-select" className="text-sm font-medium text-muted-foreground">
                {t('editor.user_switcher.label')}
              </label>
              <Select value={currentUser.id} onValueChange={handleUserChange}>
                <SelectTrigger id="user-select" className="w-full">
                  <SelectValue placeholder={t('editor.user_switcher.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        {user.role === 'admin' && (
                          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{t('editor.user_switcher.admin_badge')}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 xl:col-span-4">
            <CvEditor
              key={cvData.id}
              cvData={cvData}
              setCvData={setCvData}
              onTemplateChange={handleTemplateChange}
              allUsers={visibleUsers}
              cvPreviewRef={cvPreviewRef}
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8 sticky top-10">
            <TemplatePreview cvData={cvData} ref={cvPreviewRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
