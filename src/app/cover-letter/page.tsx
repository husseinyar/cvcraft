
"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import { Wand2, Clipboard, Check, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCV } from '@/context/cv-context';
import { generateCoverLetter } from '@/ai/flows/generate-cover-letter';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import SiteLayout from '@/components/site-layout';
import Link from 'next/link';

export default function CoverLetterPage() {
  const { t } = useTranslation();
  const { user, isLoaded, activeCv } = useCV();
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  
  const isPremiumUser = user?.role === 'premium' || user?.role === 'pro' || user?.role === 'admin';

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !activeCv) {
        toast({
            title: "Job Description or CV Missing",
            description: "Please paste a job description and ensure you have an active CV.",
            variant: "destructive"
        });
        return;
    }
    setIsLoading(true);
    setGeneratedLetter('');
    try {
        const result = await generateCoverLetter({ jobDescription, cvData: activeCv });
        setGeneratedLetter(result.coverLetterText);
    } catch (error) {
        console.error("Failed to generate cover letter:", error);
        toast({
            title: "AI Error",
            description: "The AI failed to generate a cover letter. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
  };
  
  if (!isLoaded) {
      return (
          <SiteLayout activeLink="cover-letter">
              <main className="flex-grow py-12 md:py-20 container mx-auto px-4 sm:px-6 lg:px-8">
                  <Skeleton className="h-24 w-1/2 mx-auto" />
                  <Skeleton className="h-64 w-full mt-8" />
              </main>
          </SiteLayout>
      );
  }

  return (
    <SiteLayout activeLink="cover-letter">
      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Cover Letter Builder</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Create a powerful, tailored cover letter in seconds. Just paste the job description, and our AI will write a compelling letter based on your saved CV.
                </p>
            </div>
            
            {!isPremiumUser && (
                <Card className="max-w-3xl mx-auto text-center p-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Star className="text-amber-500" /> Premium Feature
                        </CardTitle>
                        <CardDescription>
                            The AI Cover Letter Builder is a premium feature. Please upgrade your plan to generate unlimited, tailored cover letters.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/pricing">
                            <Button size="lg">Upgrade to Premium</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8 ${!isPremiumUser ? 'opacity-50 pointer-events-none' : ''}`}>
                <Card>
                    <CardHeader>
                        <CardTitle>1. Job Description</CardTitle>
                        <CardDescription>Paste the full job description below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Textarea 
                            placeholder="Paste job description here..."
                            rows={15}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            disabled={!isPremiumUser}
                         />
                         <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !isLoaded || !isPremiumUser} 
                            className="w-full mt-4"
                            size="lg"
                         >
                            <Wand2 className="mr-2" />
                            {isLoading ? "Generating..." : "Generate Cover Letter"}
                         </Button>
                         {!isLoaded && <p className="text-xs text-center mt-2 text-muted-foreground">Loading CV data...</p>}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>2. Your Generated Letter</CardTitle>
                        <CardDescription>Review, edit, and copy your new cover letter.</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                        {isLoading ? (
                             <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <br />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                             </div>
                        ) : (
                            <>
                                <Textarea
                                    value={generatedLetter}
                                    onChange={(e) => setGeneratedLetter(e.target.value)}
                                    rows={15}
                                    placeholder="Your generated cover letter will appear here..."
                                    className="h-full"
                                    disabled={!isPremiumUser}
                                />
                                {generatedLetter && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleCopyToClipboard}
                                        className="absolute top-4 right-4"
                                        disabled={!isPremiumUser}
                                    >
                                        {hasCopied ? <Check className="text-green-500" /> : <Clipboard />}
                                    </Button>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </SiteLayout>
  );
}
