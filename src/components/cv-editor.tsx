
"use client";

import { useState, useEffect, useRef } from "react";
import type { CVData, TemplateOption, Experience, Education } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { suggestImprovements } from "@/ai/flows/suggest-improvements";
import { Wand2, X, Briefcase, Paintbrush, MinusSquare, PlusCircle, Users, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/context/language-context";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  onTemplateChange: (template: TemplateOption) => void;
  allUsers: CVData[];
  cvPreviewRef: React.RefObject<HTMLDivElement>;
}

export default function CvEditor({ cvData: initialCvData, setCvData: setGlobalCvData, onTemplateChange, allUsers, cvPreviewRef }: CvEditorProps) {
  const { toast } = useToast();
  const [cvData, setCvData] = useState(initialCvData);
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const { t } = useTranslation();
  
  const isEditingAdmin = allUsers.find(u => u.id === cvData.id)?.role === 'admin';

  useEffect(() => {
    setCvData(initialCvData);
  }, [initialCvData]);

  useEffect(() => {
    setGlobalCvData(cvData);
  }, [cvData, setGlobalCvData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setCvData(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleDynamicChange = <T extends Experience | Education>(section: 'experience' | 'education', index: number, field: keyof T, value: string) => {
    setCvData(prev => {
      const newSection = [...prev[section]];
      (newSection[index] as any)[field] = value;
      return { ...prev, [section]: newSection };
    });
  };

   const addDynamicItem = (section: 'experience' | 'education') => {
    setCvData(prev => {
      const newItem = section === 'experience'
        ? { id: `exp${Date.now()}`, role: '', company: '', dates: '', description: '' }
        : { id: `edu${Date.now()}`, school: '', degree: '', dates: '', description: '' };
      return { ...prev, [section]: [...prev[section], newItem] };
    });
  };

  const removeDynamicItem = (section: 'experience' | 'education', index: number) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleGetSuggestions = async (cvSection: string) => {
    if (!jobDescription.trim()) {
      toast({
        title: t('editor.toast.job_description_missing.title'),
        description: t('editor.toast.job_description_missing.description'),
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const result = await suggestImprovements({ jobDescription, cvSection });
      setSuggestions(result.suggestions);
      setIsSuggestionModalOpen(true);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      toast({
        title: t('editor.toast.ai_error.title'),
        description: t('editor.toast.ai_error.description'),
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!cvData.skills.includes(skillsInput.trim())) {
        setCvData(prev => ({ ...prev, skills: [...prev.skills, skillsInput.trim()] }));
      }
      setSkillsInput("");
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleUserSelectionForEditing = (userId: string) => {
    const userToEdit = allUsers.find(u => u.id === userId);
    if(userToEdit) {
      setCvData(userToEdit);
    }
  }
  
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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('editor.title')}</span>
          {isEditingAdmin && <Badge variant="secondary">{t('editor.admin_view_badge')}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditingAdmin && (
           <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center"><Users className="mr-2"/>{t('editor.manage_users.title')}</h3>
             <Select onValueChange={handleUserSelectionForEditing} defaultValue={cvData.id}>
               <SelectTrigger>
                 <SelectValue placeholder={t('editor.manage_users.placeholder')} />
               </SelectTrigger>
               <SelectContent>
                 {allUsers.map(user => (
                   <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('editor.template.title')}</h3>
          <Tabs defaultValue={cvData.template} onValueChange={(value) => onTemplateChange(value as TemplateOption)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="professional"><Briefcase className="mr-2" />{t('templates.professional')}</TabsTrigger>
              <TabsTrigger value="creative"><Paintbrush className="mr-2" />{t('templates.creative')}</TabsTrigger>
              <TabsTrigger value="minimal"><MinusSquare className="mr-2" />{t('templates.minimal')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="ai-assist">
          <AccordionItem value="ai-assist">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.ai_assistant.title')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('editor.ai_assistant.description')}
              </p>
              <Textarea
                placeholder={t('editor.ai_assistant.placeholder')}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="personal-details">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.personal_details.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Input name="name" value={cvData.name} onChange={handleInputChange} placeholder={t('editor.personal_details.full_name')} />
              <Input name="jobTitle" value={cvData.jobTitle} onChange={handleInputChange} placeholder={t('editor.personal_details.job_title')} />
              <Input name="contact.email" value={cvData.contact.email} onChange={handleInputChange} placeholder={t('editor.personal_details.email')} type="email" />
              <Input name="contact.phone" value={cvData.contact.phone} onChange={handleInputChange} placeholder={t('editor.personal_details.phone')} />
              <Input name="contact.website" value={cvData.contact.website} onChange={handleInputChange} placeholder={t('editor.personal_details.website')} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.summary.title')}</AccordionTrigger>
            <AccordionContent>
              <Textarea name="summary" value={cvData.summary} onChange={handleInputChange} placeholder={t('editor.summary.placeholder')} rows={5} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.experience.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <Card key={exp.id} className="bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('experience', index)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input placeholder={t('editor.experience.role')} value={exp.role} onChange={(e) => handleDynamicChange('experience', index, 'role', e.target.value)} />
                    <Input placeholder={t('editor.experience.company')} value={exp.company} onChange={(e) => handleDynamicChange('experience', index, 'company', e.target.value)} />
                    <Input placeholder={t('editor.experience.dates')} value={exp.dates} onChange={(e) => handleDynamicChange('experience', index, 'dates', e.target.value)} />
                    <Textarea placeholder={t('editor.experience.description')} rows={4} value={exp.description} onChange={(e) => handleDynamicChange('experience', index, 'description', e.target.value)} />
                    <Button onClick={() => handleGetSuggestions(exp.description)} disabled={isSuggesting || !jobDescription.trim()} size="sm">
                      <Wand2 className="mr-2 h-4 w-4" />
                      {isSuggesting ? t('editor.experience.thinking') : t('editor.experience.get_suggestions')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addDynamicItem('experience')} variant="outline" className="w-full"><PlusCircle className="mr-2" />{t('editor.experience.add_experience')}</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.education.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {cvData.education.map((edu, index) => (
                <Card key={edu.id} className="bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('education', index)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input placeholder={t('editor.education.school')} value={edu.school} onChange={(e) => handleDynamicChange('education', index, 'school', e.target.value)} />
                    <Input placeholder={t('editor.education.degree')} value={edu.degree} onChange={(e) => handleDynamicChange('education', index, 'degree', e.target.value)} />
                    <Input placeholder={t('editor.education.dates')} value={edu.dates} onChange={(e) => handleDynamicChange('education', index, 'dates', e.target.value)} />
                    <Textarea placeholder={t('editor.education.description')} rows={2} value={edu.description} onChange={(e) => handleDynamicChange('education', index, 'description', e.target.value)} />
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addDynamicItem('education')} variant="outline" className="w-full"><PlusCircle className="mr-2"/>{t('editor.education.add_education')}</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.skills.title')}</AccordionTrigger>
            <AccordionContent>
              <Input 
                placeholder={t('editor.skills.placeholder')}
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={handleSkillsKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {cvData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button onClick={handleDownloadPdf} className="w-full mt-6">
          <Download className="mr-2" />
          {t('editor.download_pdf')}
        </Button>


        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('editor.suggestions_modal.title')}</DialogTitle>
                    <DialogDescription>
                        {t('editor.suggestions_modal.description')}
                    </DialogDescription>
                </DialogHeader>
                <ul className="space-y-2 list-disc list-inside max-h-[60vh] overflow-y-auto p-2">
                    {suggestions.map((s, i) => <li key={i} className="text-sm">{s}</li>)}
                </ul>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
