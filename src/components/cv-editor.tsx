
"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
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
import { Wand2, X, PlusCircle, Save, Trash2, CheckCircle, Bot, Zap, Search } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { updateCvAction } from "@/app/editor/actions";
import { useCV } from "@/context/cv-context";


interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
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
  const [currentSuggestionField, setCurrentSuggestionField] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreCvOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skillGapResult, setSkillGapResult] = useState<AnalyzeSkillGapOutput | null>(null);
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  // Sync with global context
  const { activeCv: globalCvData, user } = useCV();

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
    if (!currentSuggestionField || !suggestions.length || !suggestions[0].example) {
      return;
    }

    // Extract the "After" part from the first suggestion's example
    const afterTextMatch = suggestions[0].example.match(/After:\s*([\s\S]*)/i);
    if (!afterTextMatch || !afterTextMatch[1]) {
      return;
    }
    const newText = afterTextMatch[1].trim();

    const newCvData = JSON.parse(JSON.stringify(cvData));
    let current: any = newCvData;
    const keys = currentSuggestionField.split('.');
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const indexMatch = key.match(/\[(\d+)\]/);
        if (indexMatch) {
            current = current[key.replace(indexMatch[0], '')][parseInt(indexMatch[1], 10)];
        } else {
            current = current[key];
        }
    }
    
    const lastKey = keys[keys.length - 1];
    const indexMatch = lastKey.match(/\[(\d+)\]/);
     if (indexMatch) {
        current[lastKey.replace(indexMatch[0], '')][parseInt(indexMatch[1], 10)] = newText;
    } else {
       current[lastKey] = newText;
    }
    
    // To update a specific description in an experience item
    if (keys[0] === 'experience' && keys.length === 3) {
      newCvData.experience[parseInt(keys[1], 10)].description = newText;
    } else if (keys[0] === 'summary') {
      newCvData.summary = newText;
    }


    setCvData(newCvData);
    setIsSuggestionModalOpen(false);
    setCurrentSuggestionField(null);

    toast({
      title: "Changes Applied",
      description: "The AI suggestion has been added to your CV. You can edit it further.",
    });
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
    if (!user) {
        toast({
            title: "Not Logged In",
            description: "Please log in to save your CV to the cloud.",
            variant: "destructive"
        });
        return;
    }
    startTransition(() => {
        // Use the memoized globalCvData for saving
        if (!globalCvData) return;
        updateCvAction(globalCvData).then((res) => {
            if (res.success) {
                toast({
                    title: "CV Saved",
                    description: "Your changes have been saved to the cloud.",
                });
            } else {
                 toast({
                    title: "Error",
                    description: "Could not save changes to the cloud.",
                    variant: "destructive"
                });
            }
        })
    });
  };

  const handleScoreCv = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: t('editor.toast.job_description_missing.title'),
        description: t('editor.toast.job_description_missing.description'),
        variant: "destructive",
      });
      return;
    }
    setIsScoring(true);
    setScoreResult(null);
    try {
      const result = await scoreCv({ jobDescription, cvData });
      setScoreResult(result);
    } catch (error) {
      console.error("Failed to score CV:", error);
      toast({
        title: t('editor.toast.ai_error.title'),
        description: "The AI failed to score your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };
  
  const handleAnalyzeSkillGap = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: t('editor.toast.job_description_missing.title'),
        description: t('editor.toast.job_description_missing.description'),
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    setSkillGapResult(null);
    try {
      const result = await analyzeSkillGap({ jobDescription, cvData });
      setSkillGapResult(result);
    } catch (error) {
      console.error("Failed to analyze skill gap:", error);
      toast({
        title: t('editor.toast.ai_error.title'),
        description: "The AI failed to analyze your skill gap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">{cvData.cvName || "CV Editor"}</h2>
        <Accordion type="multiple" className="w-full" defaultValue={['ai-assist', 'personal-details']}>
          <AccordionItem value="ai-assist">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.ai_assistant.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('editor.ai_assistant.description')}
              </p>
              <Textarea
                placeholder={t('editor.ai_assistant.placeholder')}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button onClick={handleScoreCv} disabled={isScoring || !jobDescription.trim()}>
                  <Zap className="mr-2" /> {isScoring ? "Scoring..." : "Score My CV"}
                </Button>
                <Button onClick={handleAnalyzeSkillGap} disabled={isAnalyzing || !jobDescription.trim()} variant="outline">
                  <Search className="mr-2" /> {isAnalyzing ? "Analyzing..." : "Analyze Skill Gap"}
                </Button>
              </div>
              
              {isScoring && <p className="text-center text-sm text-muted-foreground">AI is analyzing your CV, this may take a moment...</p>}
              {scoreResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Bot /> AI Score & Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold">Overall Score</h4>
                        <span className="font-bold text-primary text-lg">{scoreResult.overallScore}/100</span>
                      </div>
                      <Progress value={scoreResult.overallScore} />
                      <p className="text-xs text-muted-foreground mt-2">{scoreResult.summary}</p>
                    </div>
                    <div className="space-y-3">
                      {scoreResult.scores.map(metric => (
                        <div key={metric.metric}>
                          <div className="flex justify-between items-baseline mb-1">
                             <h5 className="font-semibold text-sm">{metric.metric}</h5>
                             <span className="font-semibold text-sm text-muted-foreground">{metric.score}/100</span>
                          </div>
                          <Progress value={metric.score} />
                           <p className="text-xs text-muted-foreground mt-1">{metric.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isAnalyzing && <p className="text-center text-sm text-muted-foreground">AI is checking for missing skills...</p>}
               {skillGapResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Bot /> Skill Gap Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <p className="text-sm text-muted-foreground">{skillGapResult.summary}</p>
                     <div className="flex flex-wrap gap-2">
                        {skillGapResult.missingSkills.map(skill => (
                            <Badge key={skill} variant="destructive">{skill}</Badge>
                        ))}
                     </div>
                  </CardContent>
                </Card>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="personal-details">
            <AccordionTrigger className="text-lg font-semibold">{t('editor.personal_details.title')}</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Input name="cvName" value={cvData.cvName} onChange={handleInputChange} placeholder="CV Name (e.g. For Google)" />
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
              <Button onClick={() => handleGetSuggestions(cvData.summary, 'summary')} disabled={isSuggesting || !jobDescription.trim()} size="sm" className="mt-2">
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
                    <Button onClick={() => handleGetSuggestions(exp.description, `experience.${index}.description`)} disabled={isSuggesting || !jobDescription.trim()} size="sm">
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
            <Button onClick={handleSaveChanges} className="w-full" disabled={isPending || !user}>
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
                 <DialogFooter className="pt-4 border-t">
                    <div className="w-full text-center">
                        <p className="text-xs text-muted-foreground mb-2">Click ‘Apply Suggestion’ to instantly update your CV. You can edit it anytime.</p>
                        <Button onClick={handleApplySuggestion}>
                           <CheckCircle className="mr-2" /> Apply Suggestion
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
