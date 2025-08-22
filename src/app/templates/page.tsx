
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import type { TemplateOption } from '@/types';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth-button';

export default function TemplatesPage() {
  const { t } = useTranslation();

  const templates: { name: TemplateOption, hint: string }[] = [
    { name: 'otago', hint: 'resume otago' },
    { name: 'harvard', hint: 'resume harvard' },
    { name: 'princeton', hint: 'resume princeton' },
    { name: 'auckland', hint: 'resume auckland' },
    { name: 'edinburgh', hint: 'resume edinburgh' },
    { name: 'berkeley', hint: 'resume berkeley' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/cover-letter" className="text-sm font-medium text-muted-foreground hover:text-primary">Cover Letter</Link>
          <Link href="/templates" className="text-sm font-medium text-primary hover:text-primary">{t('nav.templates')}</Link>
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
                <Link href="/cover-letter" className="text-lg font-medium text-muted-foreground hover:text-primary">Cover Letter</Link>
                <Link href="/templates" className="text-lg font-medium text-primary hover:text-primary">{t('nav.templates')}</Link>
                <Link href="/blog" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
                <Link href="/pricing" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
                <Link href="/contact" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
                <AuthButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('templates.title')}</h2>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">{t('templates.subtitle')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map(template => (
                        <div key={template.name} className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                          <Image 
                            src={`https://placehold.co/400x550.png`} 
                            width={400} 
                            height={550} 
                            alt={`${t(`templates.${template.name}` as any)} Template`} 
                            className="rounded-md w-full" 
                            data-ai-hint={template.hint}
                          />
                          <p className="mt-4 font-semibold text-lg">{t(`templates.${template.name}` as any)}</p>
                           <Link href="/editor" className="mt-2 inline-block">
                                <Button variant="link">{t('templates.use_template')}</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
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
