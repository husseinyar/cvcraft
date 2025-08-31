
"use client";

import { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import type { CVData, Experience, Education, Language, Certification, Award, VolunteerWork } from "@/types";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { suggestImprovements, type SuggestImprovementsOutput } from "@/ai/flows/suggest-improvements";
import { generateExperience } from "@/ai/flows/generate-experience";
import { Wand2, X, PlusCircle, Save, Trash2, CheckCircle, GripVertical, Sparkles } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { updateCvAction } from "@/app/editor/actions";
import { useCV } from "@/context/cv-context";
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import debounce from 'lodash/debounce';
import { isValidUrl, normalizeUrl } from "@/lib/utils";
import { Label } from "./ui/label";


interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
  jobDescription: string;
}

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  'personal-details': PersonalDetailsSection,
  'contact': ContactSection,
  'summary': SummarySection,
  'experience': ExperienceSection,
  'education': EducationSection,
  'skills': SkillsSection,
  'languages': LanguagesSection,
  'certifications': CertificationsSection,
  'awards': AwardsSection,
  'volunteering': VolunteeringSection,
};

// New Sortable Accordion Item component
function SortableAccordionItem({ id, children, trigger, ...props }: { id: string, children: React.ReactNode, trigger: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...props}>
      <AccordionItem value={id} className="relative">
        <div className="absolute left-[-1rem] top-0 bottom-0 flex items-center">
          <button {...attributes} {...listeners} className="cursor-grab p-1 text-muted-foreground/50 hover:text-muted-foreground">
            <GripVertical size={16} />
          </button>
        </div>
        <AccordionTrigger className="text-lg font-semibold pl-4">{trigger}</AccordionTrigger>
        {children}
      </AccordionItem>
    </div>
  );
}


export default function CvEditor({ cvData: initialCvData, setCvData: setGlobalCvData, jobDescription }: CvEditorProps) {
  const { toast } = useToast();
  const [cvData, setCvData] = useState(initialCvData);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [currentSuggestionField, setCurrentSuggestionField] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestImprovementsOutput['suggestions']>([]);
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const { user } = useCV();

  useEffect(() => {
    setCvData(initialCvData);
  }, [initialCvData]);

  // Debounced update to the global context to avoid excessive re-renders
  // and also update localStorage via the context's useEffect
  const debouncedSetGlobalCvData = useMemo(
    () => debounce((newCvData: CVData) => {
        setGlobalCvData(newCvData);
    }, 500),
    [setGlobalCvData]
  );
  
  // Local state updates instantly, global state is debounced
  const handleLocalCvChange = useCallback((newCvData: CVData) => {
      const updatedCvWithTimestamp = { ...newCvData, updatedAt: Date.now() };
      setCvData(updatedCvWithTimestamp);
      debouncedSetGlobalCvData(updatedCvWithTimestamp);
  }, [debouncedSetGlobalCvData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    const newCvData = JSON.parse(JSON.stringify(cvData));
    let current: any = newCvData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    handleLocalCvChange(newCvData);
  };

  const handleGetSuggestions = async (cvSection: string, fieldPath: string) => {
    if (!jobDescription.trim()) {
      toast({
        title: t('editor.toast.job_description_missing.title'),
        description: t('editor.toast.job_description_missing.description'),
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setCurrentSuggestionField(fieldPath);
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

  const handleApplySuggestion = () => {
    if (!currentSuggestionField || !suggestions.length || !suggestions[0].example) return;
    const afterTextMatch = suggestions[0].example.match(/After:\s*([\s\S]*)/i);
    if (!afterTextMatch || !afterTextMatch[1]) return;
    const newText = afterTextMatch[1].trim();

    const newCvData = JSON.parse(JSON.stringify(cvData));
    
    if (currentSuggestionField === 'summary') {
      newCvData.summary = newText;
    } else {
      const [section, indexStr, field] = currentSuggestionField.split('.');
      if ((section === 'experience' || section === 'education') && indexStr && field) {
        const index = parseInt(indexStr, 10);
        if (!isNaN(index) && newCvData[section][index]) {
          (newCvData[section][index] as any)[field] = newText;
        }
      }
    }

    handleLocalCvChange(newCvData);
    setIsSuggestionModalOpen(false);
    setCurrentSuggestionField(null);

    toast({
      title: "Changes Applied",
      description: "The AI suggestion has been added to your CV.",
    });
  };
  
  const handleSaveChanges = () => {
    if (!user) {
        toast({ title: "Not Logged In", description: "Please log in to save your CV.", variant: "destructive" });
        return;
    }
    startTransition(() => {
        // Ensure we're saving the most up-to-date local state
        updateCvAction(cvData).then((res) => {
            toast({ title: res.success ? "CV Saved" : "Error", description: res.message });
        });
    });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.sectionOrder.indexOf(active.id as string);
      const newIndex = cvData.sectionOrder.indexOf(over.id as string);
      const newSectionOrder = arrayMove(cvData.sectionOrder, oldIndex, newIndex);
      handleLocalCvChange({ ...cvData, sectionOrder: newSectionOrder });
    }
  };
  
  const handleAddSection = (sectionId: keyof CVData) => {
      const updatedCv = { ...cvData };
      // If section doesn't exist, initialize it
      const currentSection = updatedCv[sectionId] as any[];
      if (!currentSection || currentSection.length === 0) {
          (updatedCv as any)[sectionId] = [];
      }
      // If it exists but not in order, add it to order
      if (!updatedCv.sectionOrder.includes(sectionId as string)) {
          updatedCv.sectionOrder = [...updatedCv.sectionOrder, sectionId as string];
      }
      handleLocalCvChange(updatedCv);
  };

  const sectionProps = {
    cvData,
    handleLocalCvChange,
    handleInputChange,
    handleGetSuggestions,
    isSuggesting,
    jobDescription,
    t
  };
  
  const sectionTitles: { [key: string]: string } = {
    'personal-details': t('editor.personal_details.title'),
    'contact': 'Contact',
    'summary': t('editor.summary.title'),
    'experience': t('editor.experience.title'),
    'education': t('editor.education.title'),
    'skills': t('editor.skills.title'),
    'languages': 'Languages',
    'certifications': 'Certifications',
    'awards': 'Awards',
    'volunteering': 'Volunteering',
  };

  const availableSections: { id: keyof CVData; label: string }[] = [
      { id: 'languages', label: 'Languages' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'awards', label: 'Awards' },
      { id: 'volunteering', label: 'Volunteering' },
  ].filter(section => !cvData.sectionOrder.includes(section.id as string));

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">{cvData.cvName || "CV Editor"}</h2>
        <Accordion type="multiple" className="w-full" defaultValue={['personal-details']}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={cvData.sectionOrder} strategy={verticalListSortingStrategy}>
              {cvData.sectionOrder.map((sectionId) => {
                const SectionComponent = SECTION_COMPONENTS[sectionId];
                if (!SectionComponent) return null;
                return (
                  <SortableAccordionItem key={sectionId} id={sectionId} trigger={sectionTitles[sectionId]}>
                    <AccordionContent>
                      <SectionComponent {...sectionProps} />
                    </AccordionContent>
                  </SortableAccordionItem>
                );
              })}
            </SortableContext>
          </DndContext>
        </Accordion>
        
        <div className="flex items-center gap-4 mt-6">
            <Button onClick={handleSaveChanges} className="w-full" disabled={isPending || !user}><Save className="mr-2" />{isPending ? "Saving..." : "Save to Cloud"}</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={availableSections.length === 0}><PlusCircle className="mr-2" /> Add Section</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableSections.map(section => (
                  <DropdownMenuItem key={section.id} onClick={() => handleAddSection(section.id)}>
                    {section.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{t('editor.suggestions_modal.title')}</DialogTitle><DialogDescription>{t('editor.suggestions_modal.description')}</DialogDescription></DialogHeader><div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">{suggestions.map((s, i) => (<Card key={i} className="bg-muted/50"><CardContent className="p-4"><p className="font-semibold text-sm mb-2">{s.suggestion}</p>{s.example && (<div className="text-xs text-muted-foreground bg-background/50 p-2 rounded-md whitespace-pre-wrap">{s.example}</div>)}</CardContent></Card>))}</div><DialogFooter className="pt-4 border-t"><div className="w-full text-center"><p className="text-xs text-muted-foreground mb-2">Click ‘Apply Suggestion’ to instantly update your CV. You can edit it anytime.</p><Button onClick={handleApplySuggestion}><CheckCircle className="mr-2" /> Apply Suggestion</Button></div></DialogFooter></DialogContent>
        </Dialog>
    </div>
  );
}


// --- Section Components ---

function PersonalDetailsSection({ cvData, handleInputChange, t }: any) {
  return (
    <div className="space-y-4 p-2">
      <Input name="cvName" value={cvData.cvName} onChange={handleInputChange} placeholder="CV Name (e.g. For Google)" />
      <Input name="name" value={cvData.name} onChange={handleInputChange} placeholder={t('editor.personal_details.full_name')} />
      <Input name="jobTitle" value={cvData.jobTitle} onChange={handleInputChange} placeholder={t('editor.personal_details.job_title')} />
    </div>
  );
}

function ContactSection({ cvData, handleInputChange, handleLocalCvChange, t }: any) {
  const [urlErrors, setUrlErrors] = useState<{ website?: string; linkedin?: string }>({});

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.split('.')[1] as 'website' | 'linkedin';

    if (value && !isValidUrl(value)) {
      setUrlErrors(prev => ({ ...prev, [fieldName]: "Please enter a valid URL (e.g., https://example.com)" }));
    } else {
      setUrlErrors(prev => ({ ...prev, [fieldName]: undefined }));
      if (value) {
        const normalized = normalizeUrl(value);
        if (normalized !== value) {
          // Update the global state with the normalized URL
          const newCvData = JSON.parse(JSON.stringify(cvData));
          newCvData.contact[fieldName] = normalized;
          handleLocalCvChange(newCvData);
        }
      }
    }
  };

  return (
    <div className="space-y-4 p-2">
      <Input name="contact.email" value={cvData.contact.email} onChange={handleInputChange} placeholder={t('editor.personal_details.email')} type="email" />
      <Input name="contact.phone" value={cvData.contact.phone} onChange={handleInputChange} placeholder={t('editor.personal_details.phone')} />
      
      <div>
        <Input 
          name="contact.website" 
          value={cvData.contact.website || ''} 
          onChange={handleInputChange} 
          onBlur={handleUrlBlur}
          placeholder={t('editor.personal_details.website')} 
        />
        {urlErrors.website && <p className="text-xs text-destructive mt-1">{urlErrors.website}</p>}
      </div>

      <div>
        <Input 
          name="contact.linkedin" 
          value={cvData.contact.linkedin || ''} 
          onChange={handleInputChange} 
          onBlur={handleUrlBlur}
          placeholder="LinkedIn Profile URL" 
        />
         {urlErrors.linkedin && <p className="text-xs text-destructive mt-1">{urlErrors.linkedin}</p>}
      </div>
    </div>
  );
}

function SummarySection({ cvData, handleInputChange, handleGetSuggestions, isSuggesting, jobDescription, t }: any) {
  return (
    <div className="p-2">
      <Textarea name="summary" value={cvData.summary} onChange={handleInputChange} placeholder={t('editor.summary.placeholder')} rows={5} />
      <Button onClick={() => handleGetSuggestions(cvData.summary, 'summary')} disabled={isSuggesting || !jobDescription.trim()} size="sm" className="mt-2">
        <Wand2 className="mr-2 h-4 w-4" />
        {isSuggesting ? t('editor.experience.thinking') : t('editor.experience.get_suggestions')}
      </Button>
    </div>
  );
}

function ExperienceSection({ cvData, handleLocalCvChange, handleGetSuggestions, isSuggesting, jobDescription, t }: any) {
  const [isGenerating, setIsGenerating] = useState<Record<number, boolean>>({});

  const handleDynamicChange = (index: number, field: keyof Experience, value: string) => {
    const newCvData = JSON.parse(JSON.stringify(cvData));
    (newCvData.experience[index] as any)[field] = value;
    handleLocalCvChange(newCvData);
  };
  
  const addDynamicItem = () => {
    const newItem = { id: `exp${Date.now()}`, role: '', company: '', dates: '', description: '' };
    handleLocalCvChange({ ...cvData, experience: [...cvData.experience, newItem] });
  };
  
  const removeDynamicItem = (index: number) => {
    handleLocalCvChange({ ...cvData, experience: cvData.experience.filter((_: any, i: number) => i !== index) });
  };

  const handleGenerateExperience = async (index: number) => {
    const exp = cvData.experience[index];
    if (!exp.role) {
        // In a real app, you might use a toast notification here.
        alert("Please enter a role before generating with AI.");
        return;
    }
    setIsGenerating(prev => ({...prev, [index]: true}));
    try {
        const result = await generateExperience({ role: exp.role, company: exp.company });
        const bulletPoints = result.bulletPoints.map(pt => `• ${pt}`).join('\n');
        handleDynamicChange(index, 'description', bulletPoints);
    } catch (error) {
        console.error("Failed to generate experience:", error);
        alert("The AI failed to generate bullet points. Please try again.");
    } finally {
        setIsGenerating(prev => ({...prev, [index]: false}));
    }
  };

  return (
    <div className="space-y-4 p-2">
      {cvData.experience.map((exp: Experience, index: number) => (
        <Card key={exp.id} className="bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            <Input placeholder={t('editor.experience.role')} value={exp.role} onChange={(e) => handleDynamicChange(index, 'role', e.target.value)} />
            <Input placeholder={t('editor.experience.company')} value={exp.company} onChange={(e) => handleDynamicChange(index, 'company', e.target.value)} />
            <Input placeholder={t('editor.experience.dates')} value={exp.dates} onChange={(e) => handleDynamicChange(index, 'dates', e.target.value)} />
            <Textarea placeholder={t('editor.experience.description')} rows={4} value={exp.description} onChange={(e) => handleDynamicChange(index, 'description', e.target.value)} />
            <div className="flex gap-2">
                <Button onClick={() => handleGenerateExperience(index)} disabled={isGenerating[index] || !exp.role} size="sm" variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating[index] ? 'Generating...' : 'Generate with AI'}
                </Button>
                <Button onClick={() => handleGetSuggestions(exp.description, `experience.${index}.description`)} disabled={isSuggesting || !jobDescription.trim()} size="sm">
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isSuggesting ? t('editor.experience.thinking') : 'Improve Text'}
                </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" />{t('editor.experience.add_experience')}</Button>
    </div>
  );
}

function EducationSection({ cvData, handleLocalCvChange, t }: any) {
    const handleDynamicChange = (index: number, field: keyof Education, value: string) => {
        const newCvData = JSON.parse(JSON.stringify(cvData));
        (newCvData.education[index] as any)[field] = value;
        handleLocalCvChange(newCvData);
    };
    const addDynamicItem = () => {
        const newItem = { id: `edu${Date.now()}`, school: '', degree: '', dates: '', description: '' };
        handleLocalCvChange({ ...cvData, education: [...cvData.education, newItem] });
    };
    const removeDynamicItem = (index: number) => {
        handleLocalCvChange({ ...cvData, education: cvData.education.filter((_: any, i: number) => i !== index) });
    };

    return (
        <div className="space-y-4 p-2">
            {cvData.education.map((edu: Education, index: number) => (
                <Card key={edu.id} className="bg-card/50">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                        <Input placeholder={t('editor.education.school')} value={edu.school} onChange={(e) => handleDynamicChange(index, 'school', e.target.value)} />
                        <Input placeholder={t('editor.education.degree')} value={edu.degree} onChange={(e) => handleDynamicChange(index, 'degree', e.target.value)} />
                        <Input placeholder={t('editor.education.dates')} value={edu.dates} onChange={(e) => handleDynamicChange(index, 'dates', e.target.value)} />
                        <Textarea placeholder={t('editor.education.description')} rows={2} value={edu.description || ''} onChange={(e) => handleDynamicChange(index, 'description', e.target.value)} />
                    </CardContent>
                </Card>
            ))}
            <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2"/>{t('editor.education.add_education')}</Button>
        </div>
    );
}

function SkillsSection({ cvData, handleLocalCvChange, t }: any) {
  const [skillsInput, setSkillsInput] = useState("");
  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!cvData.skills.includes(skillsInput.trim())) {
        handleLocalCvChange({ ...cvData, skills: [...cvData.skills, skillsInput.trim()] });
      }
      setSkillsInput("");
    }
  };
  const removeSkill = (skillToRemove: string) => {
    handleLocalCvChange({ ...cvData, skills: cvData.skills.filter((skill: string) => skill !== skillToRemove) });
  };
  
  return (
    <div className="p-2">
      <Input 
        placeholder={t('editor.skills.placeholder')}
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        onKeyDown={handleSkillsKeyDown}
      />
      <div className="flex flex-wrap gap-2 mt-4">
        {cvData.skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="text-sm">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}


function LanguagesSection({ cvData, handleLocalCvChange }: { cvData: CVData; handleLocalCvChange: (data: CVData) => void }) {
  const languages = cvData.languages || [];
  const handleDynamicChange = (index: number, field: keyof Language, value: string) => {
    const newLanguages = [...languages];
    (newLanguages[index] as any)[field] = value;
    handleLocalCvChange({ ...cvData, languages: newLanguages });
  };
  const addDynamicItem = () => {
    const newItem = { id: `lang${Date.now()}`, name: '', level: '' };
    handleLocalCvChange({ ...cvData, languages: [...languages, newItem] });
  };
  const removeDynamicItem = (index: number) => {
    handleLocalCvChange({ ...cvData, languages: languages.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 p-2">
      {languages.map((lang, index) => (
        <Card key={lang.id} className="bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            <div className="flex gap-4">
              <Input placeholder="Language (e.g., English)" value={lang.name} onChange={(e) => handleDynamicChange(index, 'name', e.target.value)} />
              <Input placeholder="Level (e.g., Native)" value={lang.level} onChange={(e) => handleDynamicChange(index, 'level', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" /> Add Language</Button>
    </div>
  );
}

function CertificationsSection({ cvData, handleLocalCvChange }: { cvData: CVData; handleLocalCvChange: (data: CVData) => void }) {
  const certifications = cvData.certifications || [];
  const handleDynamicChange = (index: number, field: keyof Certification, value: string) => {
    const newCerts = [...certifications];
    (newCerts[index] as any)[field] = value;
    handleLocalCvChange({ ...cvData, certifications: newCerts });
  };
  const addDynamicItem = () => {
    const newItem = { id: `cert${Date.now()}`, name: '', issuer: '', date: '' };
    handleLocalCvChange({ ...cvData, certifications: [...certifications, newItem] });
  };
  const removeDynamicItem = (index: number) => {
    handleLocalCvChange({ ...cvData, certifications: certifications.filter((_, i) => i !== index) });
  };
  
  return (
     <div className="space-y-4 p-2">
      {certifications.map((cert, index) => (
        <Card key={cert.id} className="bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            <Input placeholder="Certification Name" value={cert.name} onChange={(e) => handleDynamicChange(index, 'name', e.target.value)} />
            <Input placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => handleDynamicChange(index, 'issuer', e.target.value)} />
            <Input placeholder="Date (e.g., 2023)" value={cert.date} onChange={(e) => handleDynamicChange(index, 'date', e.target.value)} />
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" /> Add Certification</Button>
    </div>
  );
}

function AwardsSection({ cvData, handleLocalCvChange }: { cvData: CVData; handleLocalCvChange: (data: CVData) => void }) {
  const awards = cvData.awards || [];
  const handleDynamicChange = (index: number, field: keyof Award, value: string) => {
    const newAwards = [...awards];
    (newAwards[index] as any)[field] = value;
    handleLocalCvChange({ ...cvData, awards: newAwards });
  };
  const addDynamicItem = () => {
    const newItem = { id: `award${Date.now()}`, name: '', issuer: '', date: '' };
    handleLocalCvChange({ ...cvData, awards: [...awards, newItem] });
  };
  const removeDynamicItem = (index: number) => {
    handleLocalCvChange({ ...cvData, awards: awards.filter((_, i) => i !== index) });
  };

  return (
     <div className="space-y-4 p-2">
      {awards.map((award, index) => (
        <Card key={award.id} className="bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            <Input placeholder="Award Name" value={award.name} onChange={(e) => handleDynamicChange(index, 'name', e.target.value)} />
            <Input placeholder="Awarding Organization" value={award.issuer} onChange={(e) => handleDynamicChange(index, 'issuer', e.target.value)} />
            <Input placeholder="Date (e.g., 2023)" value={award.date} onChange={(e) => handleDynamicChange(index, 'date', e.target.value)} />
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" /> Add Award</Button>
    </div>
  );
}

function VolunteeringSection({ cvData, handleLocalCvChange }: { cvData: CVData; handleLocalCvChange: (data: CVData) => void }) {
  const volunteering = cvData.volunteering || [];
  const handleDynamicChange = (index: number, field: keyof VolunteerWork, value: string) => {
    const newVolunteering = [...volunteering];
    (newVolunteering[index] as any)[field] = value;
    handleLocalCvChange({ ...cvData, volunteering: newVolunteering });
  };
  const addDynamicItem = () => {
    const newItem = { id: `vol${Date.now()}`, role: '', organization: '', dates: '', description: '' };
    handleLocalCvChange({ ...cvData, volunteering: [...volunteering, newItem] });
  };
  const removeDynamicItem = (index: number) => {
    handleLocalCvChange({ ...cvData, volunteering: volunteering.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 p-2">
      {volunteering.map((vol, index) => (
        <Card key={vol.id} className="bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            <Input placeholder="Role" value={vol.role} onChange={(e) => handleDynamicChange(index, 'role', e.target.value)} />
            <Input placeholder="Organization" value={vol.organization} onChange={(e) => handleDynamicChange(index, 'organization', e.target.value)} />
            <Input placeholder="Dates" value={vol.dates} onChange={(e) => handleDynamicChange(index, 'dates', e.target.value)} />
            <Textarea placeholder="Description" rows={3} value={vol.description} onChange={(e) => handleDynamicChange(index, 'description', e.target.value)} />
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" /> Add Volunteer Work</Button>
    </div>
  );
}
