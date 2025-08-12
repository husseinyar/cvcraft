"use client";

import { useState } from "react";
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
import { Wand2, X, Briefcase, Paintbrush, MinusSquare, PlusCircle } from "lucide-react";

interface CvEditorProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  onTemplateChange: (template: TemplateOption) => void;
}

export default function CvEditor({ cvData, setCvData, onTemplateChange }: CvEditorProps) {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

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
        title: "Job Description Missing",
        description: "Please provide a job description for AI suggestions.",
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
        title: "Error",
        description: "Failed to get suggestions from AI.",
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>CV Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Template</h3>
          <Tabs defaultValue={cvData.template} onValueChange={(value) => onTemplateChange(value as TemplateOption)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="professional"><Briefcase className="mr-2" />Professional</TabsTrigger>
              <TabsTrigger value="creative"><Paintbrush className="mr-2" />Creative</TabsTrigger>
              <TabsTrigger value="minimal"><MinusSquare className="mr-2" />Minimal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="ai-assist">
          <AccordionItem value="ai-assist">
            <AccordionTrigger className="text-lg font-semibold">AI Assistant</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter a job description to get AI-powered suggestions for your work experience.
              </p>
              <Textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="personal-details">
            <AccordionTrigger className="text-lg font-semibold">Personal Details</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Input name="name" value={cvData.name} onChange={handleInputChange} placeholder="Full Name" />
              <Input name="jobTitle" value={cvData.jobTitle} onChange={handleInputChange} placeholder="Job Title" />
              <Input name="contact.email" value={cvData.contact.email} onChange={handleInputChange} placeholder="Email" type="email" />
              <Input name="contact.phone" value={cvData.contact.phone} onChange={handleInputChange} placeholder="Phone" />
              <Input name="contact.website" value={cvData.contact.website} onChange={handleInputChange} placeholder="Website/Portfolio" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold">Summary</AccordionTrigger>
            <AccordionContent>
              <Textarea name="summary" value={cvData.summary} onChange={handleInputChange} placeholder="Professional Summary" rows={5} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold">Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <Card key={exp.id} className="bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('experience', index)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input placeholder="Role" value={exp.role} onChange={(e) => handleDynamicChange('experience', index, 'role', e.target.value)} />
                    <Input placeholder="Company" value={exp.company} onChange={(e) => handleDynamicChange('experience', index, 'company', e.target.value)} />
                    <Input placeholder="Dates (e.g., Jan 2020 - Present)" value={exp.dates} onChange={(e) => handleDynamicChange('experience', index, 'dates', e.target.value)} />
                    <Textarea placeholder="Description" rows={4} value={exp.description} onChange={(e) => handleDynamicChange('experience', index, 'description', e.target.value)} />
                    <Button onClick={() => handleGetSuggestions(exp.description)} disabled={isSuggesting || !jobDescription.trim()} size="sm">
                      <Wand2 className="mr-2 h-4 w-4" />
                      {isSuggesting ? 'Thinking...' : 'Get Suggestions'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addDynamicItem('experience')} variant="outline" className="w-full"><PlusCircle className="mr-2" />Add Experience</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-semibold">Education</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {cvData.education.map((edu, index) => (
                <Card key={edu.id} className="bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDynamicItem('education', index)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input placeholder="School/University" value={edu.school} onChange={(e) => handleDynamicChange('education', index, 'school', e.target.value)} />
                    <Input placeholder="Degree/Field of Study" value={edu.degree} onChange={(e) => handleDynamicChange('education', index, 'degree', e.target.value)} />
                    <Input placeholder="Dates (e.g., 2016 - 2020)" value={edu.dates} onChange={(e) => handleDynamicChange('education', index, 'dates', e.target.value)} />
                    <Textarea placeholder="Description" rows={2} value={edu.description} onChange={(e) => handleDynamicChange('education', index, 'description', e.target.value)} />
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addDynamicItem('education')} variant="outline" className="w-full"><PlusCircle className="mr-2"/>Add Education</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-semibold">Skills</AccordionTrigger>
            <AccordionContent>
              <Input 
                placeholder="Add a skill and press Enter" 
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

        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>AI Suggestions</DialogTitle>
                    <DialogDescription>
                        Here are some suggestions to improve your CV section.
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
