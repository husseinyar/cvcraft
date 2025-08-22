
"use client";

import { useState, useEffect, useTransition } from "react";
import type { CVData, Experience, Education } from "@/types";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { suggestImprovements, type SuggestImprovementsOutput } from "@/ai/flows/suggest-improvements";
import { scoreCv, type ScoreCvOutput } from "@/ai/flows/score-cv";
import { analyzeSkillGap, type AnalyzeSkillGapOutput } from "@/ai/flows/analyze-skill-gap";
import { Wand2, X, PlusCircle, Save, Trash2, CheckCircle, Bot, Zap, Search, GripVertical } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { updateCvAction } from "@/app/editor/actions";
import { useCV } from "@/context/cv-context";
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
}

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  'personal-details': PersonalDetailsSection,
  'summary': SummarySection,
  'experience': ExperienceSection,
  'education': EducationSection,
  'skills': SkillsSection,
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


export default function CvEditor({ cvData: initialCvData, setCvData: setGlobalCvData }: CvEditorProps) {
  const { toast } = useToast();
  const [cvData, setCvData] = useState(initialCvData);
  const [jobDescription, setJobDescription] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [currentSuggestionField, setCurrentSuggestionField] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestImprovementsOutput['suggestions']>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreCvOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skillGapResult, setSkillGapResult] = useState<AnalyzeSkillGapOutput | null>(null);
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const { activeCv: globalCvData, user } = useCV();

  useEffect(() => {
    setCvData(initialCvData);
  }, [initialCvData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (JSON.stringify(initialCvData) !== JSON.stringify(cvData)) {
         setGlobalCvData(cvData);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [cvData, initialCvData, setGlobalCvData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    const newCvData = JSON.parse(JSON.stringify(cvData));
    let current: any = newCvData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setCvData(newCvData);
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

    setCvData(newCvData);
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
        if (!globalCvData) return;
        updateCvAction(globalCvData).then((res) => {
            toast({ title: res.success ? "CV Saved" : "Error", description: res.message });
        });
    });
  };

  const handleScoreCv = async () => {
    if (!jobDescription.trim()) {
      toast({ title: t('editor.toast.job_description_missing.title'), description: t('editor.toast.job_description_missing.description'), variant: "destructive" });
      return;
    }
    setIsScoring(true); setScoreResult(null);
    try {
      setScoreResult(await scoreCv({ jobDescription, cvData }));
    } catch (error) {
      toast({ title: t('editor.toast.ai_error.title'), description: "The AI failed to score your CV.", variant: "destructive" });
    } finally {
      setIsScoring(false);
    }
  };
  
  const handleAnalyzeSkillGap = async () => {
    if (!jobDescription.trim()) {
      toast({ title: t('editor.toast.job_description_missing.title'), description: t('editor.toast.job_description_missing.description'), variant: "destructive" });
      return;
    }
    setIsAnalyzing(true); setSkillGapResult(null);
    try {
      setSkillGapResult(await analyzeSkillGap({ jobDescription, cvData }));
    } catch (error) {
      toast({ title: t('editor.toast.ai_error.title'), description: "The AI failed to analyze skill gap.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCvData((prev) => {
        const oldIndex = prev.sectionOrder.indexOf(active.id as string);
        const newIndex = prev.sectionOrder.indexOf(over.id as string);
        return {
          ...prev,
          sectionOrder: arrayMove(prev.sectionOrder, oldIndex, newIndex),
        };
      });
    }
  };
  
  const sectionProps = {
    cvData,
    setCvData,
    handleInputChange,
    handleGetSuggestions,
    isSuggesting,
    jobDescription,
    t
  };
  
  const sectionTitles: { [key: string]: string } = {
    'personal-details': t('editor.personal_details.title'),
    'summary': t('editor.summary.title'),
    'experience': t('editor.experience.title'),
    'education': t('editor.education.title'),
    'skills': t('editor.skills.title'),
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">{cvData.cvName || "CV Editor"}</h2>
        <Accordion type="multiple" className="w-full" defaultValue={['ai-assist', 'personal-details']}>
          <AccordionItem value="ai-assist">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.ai_assistant.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('editor.ai_assistant.description')}</p>
              <Textarea placeholder={t('editor.ai_assistant.placeholder')} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button onClick={handleScoreCv} disabled={isScoring || !jobDescription.trim()}><Zap className="mr-2" /> {isScoring ? "Scoring..." : "Score My CV"}</Button>
                <Button onClick={handleAnalyzeSkillGap} disabled={isAnalyzing || !jobDescription.trim()} variant="outline"><Search className="mr-2" /> {isAnalyzing ? "Analyzing..." : "Analyze Skill Gap"}</Button>
              </div>
              
              {isScoring && <p className="text-center text-sm text-muted-foreground">AI is analyzing your CV...</p>}
              {scoreResult && (
                <Card className="bg-muted/50"><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bot /> AI Score & Feedback</CardTitle></CardHeader><CardContent className="space-y-4"><div><div className="flex justify-between items-baseline mb-1"><h4 className="font-semibold">Overall Score</h4><span className="font-bold text-primary text-lg">{scoreResult.overallScore}/100</span></div><Progress value={scoreResult.overallScore} /><p className="text-xs text-muted-foreground mt-2">{scoreResult.summary}</p></div><div className="space-y-3">{scoreResult.scores.map(metric => (<div key={metric.metric}><div className="flex justify-between items-baseline mb-1"><h5 className="font-semibold text-sm">{metric.metric}</h5><span className="font-semibold text-sm text-muted-foreground">{metric.score}/100</span></div><Progress value={metric.score} /><p className="text-xs text-muted-foreground mt-1">{metric.feedback}</p></div>))}</div></CardContent></Card>
              )}
              
              {isAnalyzing && <p className="text-center text-sm text-muted-foreground">AI is checking for missing skills...</p>}
              {skillGapResult && (
                <Card className="bg-muted/50"><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bot /> Skill Gap Analysis</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm text-muted-foreground">{skillGapResult.summary}</p><div className="flex flex-wrap gap-2">{skillGapResult.missingSkills.map(skill => (<Badge key={skill} variant="destructive">{skill}</Badge>))}</div></CardContent></Card>
              )}
            </AccordionContent>
          </AccordionItem>
          
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
      <Input name="contact.email" value={cvData.contact.email} onChange={handleInputChange} placeholder={t('editor.personal_details.email')} type="email" />
      <Input name="contact.phone" value={cvData.contact.phone} onChange={handleInputChange} placeholder={t('editor.personal_details.phone')} />
      <Input name="contact.website" value={cvData.contact.website || ''} onChange={handleInputChange} placeholder={t('editor.personal_details.website')} />
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

function ExperienceSection({ cvData, setCvData, handleGetSuggestions, isSuggesting, jobDescription, t }: any) {
  const handleDynamicChange = (index: number, field: keyof Experience, value: string) => {
    const newCvData = JSON.parse(JSON.stringify(cvData));
    (newCvData.experience[index] as any)[field] = value;
    setCvData(newCvData);
  };
  const addDynamicItem = () => {
    const newItem = { id: `exp${Date.now()}`, role: '', company: '', dates: '', description: '' };
    setCvData({ ...cvData, experience: [...cvData.experience, newItem] });
  };
  const removeDynamicItem = (index: number) => {
    setCvData({ ...cvData, experience: cvData.experience.filter((_: any, i: number) => i !== index) });
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
            <Button onClick={() => handleGetSuggestions(exp.description, `experience.${index}.description`)} disabled={isSuggesting || !jobDescription.trim()} size="sm">
              <Wand2 className="mr-2 h-4 w-4" />
              {isSuggesting ? t('editor.experience.thinking') : t('editor.experience.get_suggestions')}
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addDynamicItem} variant="outline" className="w-full"><PlusCircle className="mr-2" />{t('editor.experience.add_experience')}</Button>
    </div>
  );
}

function EducationSection({ cvData, setCvData, t }: any) {
    const handleDynamicChange = (index: number, field: keyof Education, value: string) => {
        const newCvData = JSON.parse(JSON.stringify(cvData));
        (newCvData.education[index] as any)[field] = value;
        setCvData(newCvData);
    };
    const addDynamicItem = () => {
        const newItem = { id: `edu${Date.now()}`, school: '', degree: '', dates: '', description: '' };
        setCvData({ ...cvData, education: [...cvData.education, newItem] });
    };
    const removeDynamicItem = (index: number) => {
        setCvData({ ...cvData, education: cvData.education.filter((_: any, i: number) => i !== index) });
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

function SkillsSection({ cvData, setCvData, t }: any) {
  const [skillsInput, setSkillsInput] = useState("");
  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!cvData.skills.includes(skillsInput.trim())) {
        setCvData({ ...cvData, skills: [...cvData.skills, skillsInput.trim()] });
      }
      setSkillsInput("");
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setCvData({ ...cvData, skills: cvData.skills.filter((skill: string) => skill !== skillToRemove) });
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
