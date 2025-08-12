
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';

export default function TemplatesPage() {
  const { t } = useTranslation();

  const templates = [
    { name: 'professional', hint: 'resume professional' },
    { name: 'creative', hint: 'resume creative' },
    { name: 'minimal', hint: 'resume minimal' },
    { name: 'modern', hint: 'resume modern' },
    { name: 'elegant', hint: 'resume elegant' },
    { name: 'bold', hint: 'resume bold' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/templates" className="text-sm font-medium text-primary hover:text-primary">{t('nav.templates')}</Link>
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
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-4">{t('templates.title')}</h2>
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
                        <li><Link href="#" className="hover:underline">{t('nav.pricing')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('footer.features')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">{t('footer.company')}</h4>
                    <ul>
                        <li><Link href="#" className="hover:underline">{t('footer.about')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('nav.blog')}</Link></li>
                        <li><Link href="#" className="hover:underline">{t('nav.contact')}</Link></li>
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
