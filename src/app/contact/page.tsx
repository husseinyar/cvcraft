
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Mail, Phone, MapPin, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth-button';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/cover-letter" className="text-sm font-medium text-muted-foreground hover:text-primary">Cover Letter</Link>
          <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
          <Link href="/contact" className="text-sm font-medium text-primary hover:text-primary">{t('nav.contact')}</Link>
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
                <Link href="/templates" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.templates')}</Link>
                <Link href="/blog" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.blog')}</Link>
                <Link href="/pricing" className="text-lg font-medium text-muted-foreground hover:text-primary">{t('nav.pricing')}</Link>
                <Link href="/contact" className="text-lg font-medium text-primary hover:text-primary">{t('nav.contact')}</Link>
                <AuthButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact_page.title')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('contact_page.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact_page.form_title')}</CardTitle>
                  <CardDescription>{t('contact_page.form_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact_page.name_label')}</Label>
                      <Input id="name" placeholder={t('contact_page.name_placeholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact_page.email_label')}</Label>
                      <Input id="email" type="email" placeholder={t('contact_page.email_placeholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact_page.message_label')}</Label>
                      <Textarea id="message" placeholder={t('contact_page.message_placeholder')} rows={5} />
                    </div>
                    <Button type="submit" className="w-full">{t('contact_page.submit_button')}</Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                  <Card>
                      <CardHeader>
                          <CardTitle>{t('contact_page.info_title')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                          <div className="flex items-center gap-4">
                              <Mail className="h-6 w-6 text-primary" />
                              <div>
                                  <h4 className="font-semibold">{t('contact_page.email')}</h4>
                                  <a href="mailto:contact@cvcraft.com" className="text-muted-foreground hover:text-primary">contact@cvcraft.com</a>
                              </div>
                          </div>
                           <div className="flex items-center gap-4">
                              <Phone className="h-6 w-6 text-primary" />
                              <div>
                                  <h4 className="font-semibold">{t('contact_page.phone')}</h4>
                                  <p className="text-muted-foreground">+46 123 456 789</p>
                              </div>
                          </div>
                           <div className="flex items-center gap-4">
                              <MapPin className="h-6 w-6 text-primary" />
                              <div>
                                  <h4 className="font-semibold">{t('contact_page.address')}</h4>
                                  <p className="text-muted-foreground">123 CV Craft St, Stockholm, Sweden</p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </div>
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
