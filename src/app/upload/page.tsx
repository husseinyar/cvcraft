
"use client";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, X, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { parseCv, type ParseCvOutput } from '@/ai/flows/parse-cv';
import type { CVData } from '@/types';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });
  
  const handleUploadAndParse = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setProgress(20);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        try {
            const base64File = reader.result as string;
            setProgress(50);
            
            const parsedData: ParseCvOutput = await parseCv({ resumeDataUri: base64File });

            setProgress(80);

            const newCvData: CVData = {
              id: `user_${Date.now()}`,
              name: parsedData.name || 'Your Name',
              jobTitle: parsedData.jobTitle || 'Your Job Title',
              contact: {
                email: parsedData.contact.email || '',
                phone: parsedData.contact.phone || '',
                website: parsedData.contact.website || '',
              },
              summary: parsedData.summary || 'A professional summary about you.',
              experience: parsedData.experience.map((exp, i) => ({ ...exp, id: `exp${i}` })),
              education: parsedData.education.map((edu, i) => ({ ...edu, id: `edu${i}` })),
              skills: parsedData.skills || [],
              template: 'otago',
              role: 'user',
            };

            // Store in sessionStorage and redirect
            sessionStorage.setItem('cv-craft-data', JSON.stringify(newCvData));
            setProgress(100);
            router.push('/editor');

        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error && err.message.includes("image-based"))
                ? "We couldn’t read your resume. It may be scanned as an image or use a format we don’t support yet. Please try a text-based PDF or DOCX file."
                : "We couldn’t read your resume. The AI might be busy or the file format is unsupported. Want to start fresh instead?";
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
          <CardDescription>Upload a .pdf or .docx file and we'll transform it into a stunning CV.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Parsing Failed</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes("Want to start fresh instead?") && (
                  <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/editor')}>
                      Start Fresh
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {!file ? (
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
          )}

          {isLoading && <Progress value={progress} className="mt-4" />}

          <Button 
            onClick={handleUploadAndParse} 
            disabled={!file || isLoading} 
            className="w-full mt-6" 
            size="lg"
          >
            {isLoading ? "Parsing your resume..." : "Upload and Continue"}
            <Wand2 className="ml-2"/>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
