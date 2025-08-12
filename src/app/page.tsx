
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot, Palette, FileText } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">CV Craft</h1>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="#templates" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
          <Button variant="outline">{t('nav.login')}</Button>
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden flex items-center gap-2">
           <LanguageSwitcher />
           <Button variant="outline">{t('nav.menu')}</Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-4">
              {t('hero.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <Link href="/editor">
              <Button size="lg">
                {t('hero.cta')} <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">{t('features.title')}</h3>
              <p className="text-muted-foreground mt-2">{t('features.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{t('features.ai.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('features.ai.description')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{t('features.templates.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('features.templates.description')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{t('features.preview.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('features.preview.description')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Template Preview Section */}
        <section id="templates" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-3xl font-bold">{t('templates.title')}</h3>
                <p className="text-muted-foreground mt-2 mb-8">{t('templates.subtitle')}</p>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Professional Template" className="rounded-md w-full" data-ai-hint="resume professional" />
                      <p className="mt-4 font-semibold">{t('templates.professional')}</p>
                    </div>
                     <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Creative Template" className="rounded-md w-full" data-ai-hint="resume creative" />
                      <p className="mt-4 font-semibold">{t('templates.creative')}</p>
                    </div>
                     <div className="p-4 border rounded-lg shadow-sm">
                      <Image src="https://placehold.co/400x550.png" width={400} height={550} alt="Minimal Template" className="rounded-md w-full" data-ai-hint="resume minimal" />
                      <p className="mt-4 font-semibold">{t('templates.minimal')}</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} CV Craft. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
