
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Bot, Palette, FileText, CheckCircle, Clock, Share2, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function FeaturesPage() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: Bot,
      title: "features_page.list.ai.title",
      description: "features_page.list.ai.description"
    },
    {
      icon: Palette,
      title: "features_page.list.templates.title",
      description: "features_page.list.templates.description"
    },
    {
      icon: FileText,
      title: "features_page.list.preview.title",
      description: "features_page.list.preview.description"
    },
     {
      icon: CheckCircle,
      title: "features_page.list.ats.title",
      description: "features_page.list.ats.description"
    },
     {
      icon: Clock,
      title: "features_page.list.save.title",
      description: "features_page.list.save.description"
    },
    {
      icon: Share2,
      title: "features_page.list.export.title",
      description: "features_page.list.export.description"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
          <Link href="/editor">
            <Button variant="outline">{t('nav.login')}</Button>
          </Link>
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
                <Link href="/templates" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
                <Link href="/blog" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
                <Link href="/pricing" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
                <Link href="/contact" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.contact')}</Link>
                <Link href="/editor">
                  <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features_page.title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('features_page.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featureList.map((feature, index) => (
                        <div key={index} className="flex gap-4">
                            <feature.icon className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{t(feature.title as any)}</h3>
                                <p className="text-muted-foreground">{t(feature.description as any)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link href="/editor">
                        <Button size="lg">{t('hero.cta')}</Button>
                    </Link>
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
