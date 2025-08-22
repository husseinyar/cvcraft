
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu, Wand2, Clipboard, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth-button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCV } from '@/context/cv-context';
import { generateCoverLetter } from '@/ai/flows/generate-cover-letter';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function CoverLetterPage() {
  const { t } = useTranslation();
  const { activeCv, isLoaded } = useCV();
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/cover-letter" className="text-sm font-medium text-primary hover:text-primary">Cover Letter</Link>
          <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
          <AuthButton />
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden flex items-center gap-2">
           <LanguageSwitcher />
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 pt-12">
                <Link href="/editor" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
                <Link href="/cover-letter" className="text-lg font-medium text-primary hover:text-primary">Cover Letter</Link>
                <Link href="/templates" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
                <Link href="/blog" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
                <Link href="/pricing" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
                <Link href="/contact" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
                <AuthButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Cover Letter Builder</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Create a powerful, tailored cover letter in seconds. Just paste the job description, and our AI will write a compelling letter based on your saved CV.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                         />
                         <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !isLoaded} 
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
                                />
                                {generatedLetter && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleCopyToClipboard}
                                        className="absolute top-4 right-4"
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

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <h4 className="font-bold mb-4">{t('footer.product')}</h4>
                    <ul>
                        <li><Link href="/templates" className="hover:underline">{t('nav.templates')}</Link></li>
                        <li><Link href="/pricing" className="hover:underline">{t('nav.pricing')}</Link></li>
                        <li><Link href="/features" className="hover:underline">{t('footer.features')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.company')}</h4>
                    <ul>
                        <li><Link href="#" className="hover:underline">{t('footer.about')}</Link></li>
                        <li><Link href="/blog" className="hover:underline">{t('nav.blog')}</Link></li>
                        <li><Link href="/contact" className="hover:underline">{t('nav.contact')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.legal')}</h4>
                    <ul>
                        <li><Link href="#" className="hover:underline">{t('footer.privacy')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('footer.terms')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.follow_us')}</h4>
                     <ul>
                        <li><Link href="#" className="hover:underline">LinkedIn</Link></li>
                        <li><Link href="#" className="hover:underline">Twitter</Link></li>
                        <li><Link href="#" className="hover:underline">Facebook</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs mt-12 pt-8 border-t border-primary-foreground/20">
             <p>&copy; {new Date().getFullYear()} CV Craft. {t('footer.rights')}</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
