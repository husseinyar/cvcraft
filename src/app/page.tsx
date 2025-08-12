
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot, Palette, FileText } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">CV Craft</h1>
        <nav>
          <Link href="/editor">
            <Button variant="outline">Go to Editor</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-4">
              Build Your Professional CV, Effortlessly
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create a stunning, ATS-friendly CV in minutes. Our AI-powered platform helps you highlight your skills and experience to land your dream job.
            </p>
            <Link href="/editor">
              <Button size="lg">
                Create Your CV Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">Why Choose CV Craft?</h3>
              <p className="text-muted-foreground mt-2">Everything you need to create the perfect CV.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">AI-Powered Suggestions</h4>
                  <p className="text-muted-foreground text-sm">Get intelligent, context-aware suggestions to improve your CV content based on job descriptions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Beautiful Templates</h4>
                  <p className="text-muted-foreground text-sm">Choose from a selection of professional, creative, and minimal templates to match your style.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Real-time Preview</h4>
                  <p className="text-muted-foreground text-sm">See your changes instantly with a live preview of your CV as you type.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Template Preview Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-3xl font-bold">Find Your Perfect Look</h3>
                <p className="text-muted-foreground mt-2 mb-8">Professionally designed templates to make you stand out.</p>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Professional Template" className="rounded-md w-full" data-ai-hint="resume professional" />
                      <p className="mt-4 font-semibold">Professional</p>
                    </div>
                     <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Creative Template" className="rounded-md w-full" data-ai-hint="resume creative" />
                      <p className="mt-4 font-semibold">Creative</p>
                    </div>
                     <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Minimal Template" className="rounded-md w-full" data-ai-hint="resume minimal" />
                      <p className="mt-4 font-semibold">Minimal</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} CV Craft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
