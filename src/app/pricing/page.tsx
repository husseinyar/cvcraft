
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Check, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function PricingPage() {
  const { t } = useTranslation();

  const pricingTiers = [
    {
      name: "pricing_page.free.name",
      price: "pricing_page.free.price",
      description: "pricing_page.free.description",
      features: [
        "pricing_page.free.features.one",
        "pricing_page.free.features.two",
        "pricing_page.free.features.three"
      ],
      cta: "pricing_page.free.cta"
    },
    {
      name: "pricing_page.pro.name",
      price: "pricing_page.pro.price",
      description: "pricing_page.pro.description",
      features: [
        "pricing_page.pro.features.one",
        "pricing_page.pro.features.two",
        "pricing_page.pro.features.three",
        "pricing_page.pro.features.four"
      ],
      cta: "pricing_page.pro.cta"
    },
    {
      name: "pricing_page.business.name",
      price: "pricing_page.business.price",
      description: "pricing_page.business.description",
      features: [
        "pricing_page.business.features.one",
        "pricing_page.business.features.two",
        "pricing_page.business.features.three",
        "pricing_page.business.features.four"
      ],
      cta: "pricing_page.business.cta"
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
          <Link href="/pricing" className="text-sm font-medium text-primary hover:text-primary">{t('nav.pricing')}</Link>
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
                <Link href="/pricing" className="text-lg font-medium text-primary hover:text-primary">{t('nav.pricing')}</Link>
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricing_page.title')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('pricing_page.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{t(tier.name as any)}</CardTitle>
                    <CardDescription>{t(tier.description as any)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <p className="text-4xl font-bold">{t(tier.price as any)}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t(feature as any)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6">
                    <Button className="w-full">{t(tier.cta as any)}</Button>
                  </div>
                </Card>
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
