
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { FAQ } from "@/components/FAQ";
import { ComparisonTable } from "@/components/ComparisonTable";
import CVStartCards from "@/components/CVStartCards";
import { ArrowRight, Shield, Zap, Target, Users, Award, TrendingUp, Menu } from "lucide-react";
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';


const pricingTiers = [
  {
    name: "Gratis",
    price: "0 kr",
    description: "Perfekt för att komma igång med ditt första CV",
    features: [
      "1 grundläggande CV-mall",
      "Standardformatering",
      "PDF-nedladdning",
      "Grundläggande redigering",
    ],
    cta: "Kom igång gratis",
    buttonVariant: "outline" as const,
  },
  {
    name: "Premium",
    price: "99 kr",
    description: "Allt du behöver för att sticka ut bland konkurrenterna",
    features: [
      "Alla professionella mallar",
      "ATS-optimering",
      "Experttips och formuleringshjälp",
      "Anpassningsbara färger och typsnitt",
      "Obegränsade nedladdningar",
      "Prioriterat support",
    ],
    cta: "Starta Premium",
    isPopular: true,
  },
  {
    name: "Pro",
    price: "199 kr",
    description: "För dig som vill maximera dina karriärmöjligheter",
    features: [
      "Allt från Premium",
      "Personligt brev-generator",
      "LinkedIn-profiloptimering",
      "1-till-1 karriärcoaching (30 min/månad)",
      "Branschspecifika tips",
      "Avancerad ATS-analys",
    ],
    cta: "Välj Pro",
  },
];

const testimonials = [
  {
    name: "Anna Lindström",
    role: "Marknadskoordinator",
    company: "Spotify",
    content: "Tack vare CV Craft fick jag min drömjobb på bara 3 veckor! ATS-optimeringen gjorde verkligen skillnad.",
    rating: 5,
  },
  {
    name: "Erik Johansson",
    role: "Utvecklare",
    company: "Klarna",
    content: "Fantastiska mallar och experttipsen hjälpte mig att formulera mina erfarenheter på rätt sätt. Rekommenderas varmt!",
    rating: 5,
  },
  {
    name: "Sofia Andersson",
    role: "Projektledare",
    company: "H&M",
    content: "Som karriärbytare var Pro-coachingen ovärderlig. Fick professionell vägledning genom hela processen.",
    rating: 5,
  },
];

const trustSignals = [
  { icon: Users, stat: "50,000+", label: "Nöjda användare" },
  { icon: Award, stat: "98%", label: "Framgångsgrad" },
  { icon: TrendingUp, stat: "300%", label: "Fler intervjuer" },
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">CV Craft</h1>
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
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-subtle"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="heading-xl">
                    Skapa ett <span className="gradient-text-animated font-bold">ATS-optimerat CV</span> som får dig anställd
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Bygg professionella CV:n som passerar automatiska filter och imponerar på rekryterare. 
                    Svenskdesignade mallar med experttips för den svenska arbetsmarknaden.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/editor">
                    <Button className="btn-hero glow-on-hover group w-full sm:w-auto">
                      <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                        Börja bygga ditt CV
                      </span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="outline" className="btn-outline group w-full sm:w-auto">
                      <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                        Se exempel-CV:n
                      </span>
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-8">
                  {trustSignals.map((signal, index) => (
                    <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                      <signal.icon className="w-8 h-8 text-primary mx-auto mb-2 group-hover:text-accent-gold transition-colors duration-300" />
                      <div className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300">{signal.stat}</div>
                      <div className="text-sm text-muted-foreground">{signal.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-xl transform scale-105"></div>
                <Image 
                  src="https://placehold.co/1024x768.png"
                  alt="Professional CV templates showcase" 
                  width={1024}
                  height={768}
                  className="w-full rounded-2xl shadow-strong hover-lift float relative z-10"
                  data-ai-hint="resume professional"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CV Start Cards */}
        <CVStartCards />

        {/* Value Propositions */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-6">Varför välja CV Craft?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vi kombinerar svensk design med AI-teknik för att skapa CV:n som verkligen fungerar
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 p-6 group hover-lift">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 glow-on-hover">
                  <Shield className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">ATS-Garanterad</h3>
                <p className="text-muted-foreground">
                  Våra mallar är testade mot de vanligaste ATS-systemen för att säkerställa att ditt CV når fram
                </p>
              </div>

              <div className="text-center space-y-4 p-6 group hover-lift">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 glow-on-hover">
                  <Zap className="w-8 h-8 text-accent-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">AI-Powered Tips</h3>
                <p className="text-muted-foreground">
                  Få personliga formuleringsförslag och optimeringstips baserade på din bransch och roll
                </p>
              </div>

              <div className="text-center space-y-4 p-6 group hover-lift">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 glow-on-hover">
                  <Target className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Svensk Design</h3>
                <p className="text-muted-foreground">
                  Minimalistiska, professionella mallar som tilltalar svenska rekryterare och företag
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-6">Välj din plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Från gratis grundfunktioner till professionell karriärcoaching - vi har en plan för alla
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <PricingCard key={index} tier={tier} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Testimonials */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-6">Vad våra användare säger</h2>
              <p className="text-muted-foreground">
                Över 50,000 svenskar har redan fått sina drömjobb med CV Craft
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className="py-24 bg-gradient-primary text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Redo att få ditt <span className="gradient-text-animated">drömjobb</span>?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Gå med i tusentals svenskar som redan har förvandlat sina karriärer med CV Craft
              </p>
              <div className="pt-4">
                <Link href="/editor">
                  <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-xl text-lg group glow-on-hover">
                    <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                      Börja bygga ditt CV idag
                    </span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
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

    