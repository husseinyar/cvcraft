
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import type { CVData, Experience, Education } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { suggestImprovements, type SuggestImprovementsOutput } from "@/ai/flows/suggest-improvements";
import { Wand2, X, PlusCircle, Save, Trash2 } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { updateCvAction } from "@/app/editor/actions";
import { useCV } from "@/context/cv-context";


interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export default function CvEditor({ cvData: initialCvData, setCvData: setGlobalCvData }: CvEditorProps) {
  const { toast } = useToast();
  // Local state for immediate input changes
  const [cvData, setCvData] = useState(initialCvData);
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestImprovementsOutput['suggestions']>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  // Sync with global context
  const { cvData: globalCvData } = useCV();

  useEffect(() => {
    setCvData(initialCvData);
  }, [initialCvData]);

  // Debounce updates to global state
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update global state if local state is different
      if (JSON.stringify(initialCvData) !== JSON.stringify(cvData)) {
         setGlobalCvData(cvData);
      }
    }, 500); // 0.5 second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [cvData, initialCvData, setGlobalCvData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    // Create a deep copy to avoid direct mutation
    const newCvData = JSON.parse(JSON.stringify(cvData));
    let current: any = newCvData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setCvData(newCvData);
  };

  const handleDynamicChange = <T extends Experience | Education>(section: 'experience' | 'education', index: number, field: keyof T, value: string) => {
    const newCvData = JSON.parse(JSON.stringify(cvData));
    (newCvData[section][index] as any)[field] = value;
    setCvData(newCvData);
  };

   const addDynamicItem = (section: 'experience' | 'education') => {
    const newItem = section === 'experience'
      ? { id: `exp${Date.now()}`, role: '', company: '', dates: '', description: '' }
      : { id: `edu${Date.now()}`, school: '', degree: '', dates: '', description: '' };
    
    const newCvData = { ...cvData, [section]: [...cvData[section], newItem] };
    setCvData(newCvData);
  };

  const removeDynamicItem = (section: 'experience' | 'education', index: number) => {
    const newCvData = {
      ...cvData,
      [section]: cvData[section].filter((_, i) => i !== index),
    };
    setCvData(newCvData);
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
        const newSkills = [...cvData.skills, skillsInput.trim()];
        const newCvData = { ...cvData, skills: newSkills };
        setCvData(newCvData);
      }
      setSkillsInput("");
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    const newSkills = cvData.skills.filter(skill => skill !== skillToRemove);
    const newCvData = { ...cvData, skills: newSkills };
    setCvData(newCvData);
  };
  
  const handleSaveChanges = () => {
    startTransition(() => {
        // Use the memoized globalCvData for saving
        if (!globalCvData) return;
        updateCvAction(globalCvData).then((res) => {
            if (res.success) {
                toast({
                    title: "CV Saved",
                    description: "Your changes have been saved to the database.",
                });
            } else {
                 toast({
                    title: "Error",
                    description: "Could not save changes to the database.",
                    variant: "destructive"
                });
            }
        })
    });
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">CV Editor</h2>
        <Accordion type="multiple" className="w-full" defaultValue={['ai-assist', 'personal-details']}>
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
              <Input name="contact.website" value={cvData.contact.website || ''} onChange={handleInputChange} placeholder={t('editor.personal_details.website')} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.summary.title')}</AccordionTrigger>
            <AccordionContent>
              <Textarea name="summary" value={cvData.summary} onChange={handleInputChange} placeholder={t('editor.summary.placeholder')} rows={5} />
              <Button onClick={() => handleGetSuggestions(cvData.summary)} disabled={isSuggesting || !jobDescription.trim()} size="sm" className="mt-2">
                <Wand2 className="mr-2 h-4 w-4" />
                {isSuggesting ? t('editor.experience.thinking') : t('editor.experience.get_suggestions')}
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.experience.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <Card key={exp.id} className="bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('experience', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('education', index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <Input placeholder={t('editor.education.school')} value={edu.school} onChange={(e) => handleDynamicChange('education', index, 'school', e.target.value)} />
                    <Input placeholder={t('editor.education.degree')} value={edu.degree} onChange={(e) => handleDynamicChange('education', index, 'degree', e.target.value)} />
                    <Input placeholder={t('editor.education.dates')} value={edu.dates} onChange={(e) => handleDynamicChange('education', index, 'dates', e.target.value)} />
                    <Textarea placeholder={t('editor.education.description')} rows={2} value={edu.description || ''} onChange={(e) => handleDynamicChange('education', index, 'description', e.target.value)} />
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
        
        <div className="flex items-center gap-4 mt-6">
            <Button onClick={handleSaveChanges} className="w-full" disabled={isPending}>
                <Save className="mr-2" />
                {isPending ? "Saving..." : "Save to Cloud"}
            </Button>
        </div>


        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('editor.suggestions_modal.title')}</DialogTitle>
                    <DialogDescription>
                      {t('editor.suggestions_modal.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                    {suggestions.map((s, i) => (
                      <Card key={i} className="bg-muted/50">
                        <CardContent className="p-4">
                          <p className="font-semibold text-sm mb-2">{s.suggestion}</p>
                          {s.example && (
                            <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded-md whitespace-pre-wrap">
                              {s.example}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
