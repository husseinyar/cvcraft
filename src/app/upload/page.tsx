
"use client";
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, X, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CVData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker script for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Client-side text parsing function
function parseResumeText(text: string): Omit<CVData, 'id' | 'template' | 'role'> {
  const lines = text.split('\n').filter(line => line.trim() !== '');

  // Very basic parsing using regex - this can be improved
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const websiteRegex = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/;

  let name = lines[0] || 'Your Name';
  let jobTitle = lines[1] || 'Your Job Title';
  let email = text.match(emailRegex)?.[0] || '';
  let phone = text.match(phoneRegex)?.[0] || '';
  let website = text.match(websiteRegex)?.[0] || '';
  
  // Find section headers
  const experienceIndex = lines.findIndex(line => /experience/i.test(line));
  const educationIndex = lines.findIndex(line => /education/i.test(line));
  const skillsIndex = lines.findIndex(line => /skills/i.test(line));
  const summaryIndex = lines.findIndex(line => /summary|profile/i.test(line));

  let summary = "A professional summary about you.";
  if (summaryIndex !== -1) {
    const nextSectionIndex = [experienceIndex, educationIndex, skillsIndex].filter(i => i > summaryIndex).sort((a,b)=> a-b)[0] || lines.length;
    summary = lines.slice(summaryIndex + 1, nextSectionIndex).join(' ');
  }

  // A very simplified experience parser
  const experience = [];
  if (experienceIndex !== -1) {
      const nextSectionIndex = [educationIndex, skillsIndex].filter(i => i > experienceIndex).sort((a,b)=> a-b)[0] || lines.length;
      const experienceLines = lines.slice(experienceIndex + 1, nextSectionIndex);
      // This simple logic assumes role, company, dates are on consecutive lines.
      for (let i = 0; i < experienceLines.length; i += 4) {
          if (experienceLines[i] && experienceLines[i+1] && experienceLines[i+2]) {
            experience.push({
                id: `exp${i}`,
                role: experienceLines[i],
                company: experienceLines[i+1],
                dates: experienceLines[i+2],
                description: experienceLines[i+3] || ''
            });
          }
      }
  }

  const education = [];
  if (educationIndex !== -1) {
      const nextSectionIndex = [skillsIndex].filter(i => i > educationIndex).sort((a,b)=> a-b)[0] || lines.length;
      const educationLines = lines.slice(educationIndex + 1, nextSectionIndex);
      for (let i = 0; i < educationLines.length; i += 3) {
          if(educationLines[i] && educationLines[i+1]) {
            education.push({
                id: `edu${i}`,
                school: educationLines[i+1],
                degree: educationLines[i],
                dates: educationLines[i+2] || '',
                description: ''
            });
          }
      }
  }

  const skills = [];
  if (skillsIndex !== -1) {
      const skillsText = lines.slice(skillsIndex + 1).join(' ');
      skills.push(...skillsText.split(/, | \/ | - /).map(s => s.trim()).filter(Boolean));
  }

  return {
    name,
    jobTitle,
    contact: { email, phone, website },
    summary,
    experience,
    education,
    skills,
  };
}


export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setError(null);
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });
  
  const handleUploadAndParse = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setProgress(10);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
        try {
            const arrayBuffer = reader.result as ArrayBuffer;
            setProgress(30);

            // Extract text from PDF
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let extractedText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                extractedText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            setProgress(60);
            
            if (!extractedText.trim()) {
                throw new Error("The PDF appears to be image-based or empty, we couldn't extract any text.");
            }

            console.log("--- Extracted Resume Text ---");
            console.log(extractedText);
            
            // Parse text on the client-side
            const parsedData = parseResumeText(extractedText);
            console.log('--- Client-side Parsed Data ---', parsedData);

            setProgress(80);

            const newCvData: CVData = {
              id: `user_${Date.now()}`,
              template: 'otago',
              role: 'user',
              ...parsedData
            };

            // Store in sessionStorage and redirect
            sessionStorage.setItem('cv-craft-data', JSON.stringify(newCvData));
            setProgress(100);
            router.push('/editor');

        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error && (err.message.includes("image-based") || err.message.includes("Invalid PDF")))
                ? "We couldn’t read your resume. It may be scanned as an image. Please try a text-based PDF file."
                : "We couldn’t process this file. Please try a different one or start fresh.";
            setError(errorMessage);
            setIsLoading(false);
            setProgress(0);
        }
    };
    reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Upload a .pdf file and we'll extract the text and transform it into a stunning CV.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Parsing Failed</AlertTitle>
              <AlertDescription>
                {error}
                <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/editor')}>
                    Start Fresh
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isMounted ? (
            !file ? (
                <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-semibold">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground">or</p>
                <Button variant="outline" className="mt-2">Browse Files</Button>
                </div>
            ) : (
                <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                    <p className="font-semibold text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                </Button>
                </div>
            )
          ) : (
             <div className="p-10 border-2 border-dashed rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
              <Skeleton className="h-9 w-1/3 mx-auto mt-2" />
            </div>
          )}

          {isLoading && <Progress value={progress} className="mt-4" />}

          <Button 
            onClick={handleUploadAndParse} 
            disabled={!file || isLoading} 
            className="w-full mt-6" 
            size="lg"
          >
            {isLoading ? "Processing your resume..." : "Upload and Continue"}
            <Wand2 className="ml-2"/>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
