
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
import { parseCvText } from '@/ai/flows/parse-cv-text';
import * as pdfjs from 'pdfjs-dist';

// Required for pdfjs-dist to work
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{ message: string, link?: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setErrorDetails(null);
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

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const fileBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument(fileBuffer);
    const pdf = await loadingTask.promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => (item as any).str).join(' ');
    }
    return text;
  };
  
  const handleUploadAndParse = async () => {
    if (!file) return;

    setIsLoading(true);
    setErrorDetails(null);
    setProgress(10);

    try {
        let resumeText = '';
        if (file.type === 'application/pdf') {
            resumeText = await extractTextFromPdf(file);
        } else {
            throw new Error('Unsupported file type.');
        }

        setProgress(30);

        console.log('--- Extracted Resume Text ---');
        console.log(resumeText.substring(0, 500)); // Log first 500 chars
        
        const parsedData = await parseCvText({ resumeText });
        
        console.log('--- AI Parsed Data ---', parsedData);

        setProgress(80);

        const newCvData: CVData = {
          id: `user_${Date.now()}`,
          template: 'onyx', // Default to the new Onyx template
          role: 'user',
          ...parsedData
        };

        sessionStorage.setItem('cv-craft-data', JSON.stringify(newCvData));
        setProgress(100);
        router.push('/editor');

    } catch (err: any) {
        console.error(err);
        let errorMessage = "We couldn’t process this file. The AI might be busy, the file format is unsupported, or it contains only images. Please try again or start fresh.";
        let errorLink;

        if (err.message && err.message.includes("SERVICE_DISABLED")) {
            const match = err.message.match(/https?:\/\/[^\s]+/);
            if (match) {
                errorLink = match[0];
                errorMessage = "The Generative Language API is not enabled for your project. Please click the link below to activate it, wait a few minutes, then try again.";
            }
        } else if (err.message && err.message.includes("timeout")) {
            errorMessage = "The AI model took too long to respond. It might be busy or you may have hit the free plan's rate limit. Please try again in a moment.";
        }
        
        setErrorDetails({ message: errorMessage, link: errorLink });
        setIsLoading(false);
        setProgress(0);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Upload a .pdf file and we'll transform it into a stunning CV.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorDetails && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Parsing Failed</AlertTitle>
              <AlertDescription>
                {errorDetails.message}
                {errorDetails.link && (
                    <a href={errorDetails.link} target="_blank" rel="noopener noreferrer" className="font-bold underline text-white mt-2 block">
                       Enable API
                    </a>
                )}
                <Button variant="link" className="p-0 h-auto ml-1 text-white/80" onClick={() => router.push('/editor')}>
                    Or Start Fresh
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
