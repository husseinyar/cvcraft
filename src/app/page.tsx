
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu, Bot, Palette, FileText, Star, ShieldCheck, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth-button';
import Image from 'next/image';
import { PricingCard } from '@/components/PricingCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { FAQ } from '@/components/FAQ';
import CVStartCards from '@/components/CVStartCards';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
      {
        icon: ShieldCheck,
        title: "ATS-Guaranteed",
        description: "Our templates are designed to pass through Applicant Tracking Systems, ensuring your CV gets seen by a human."
      },
      {
        icon: Zap,
        title: "AI-Powered Tips",
        description: "Get personalized feedback and content suggestions to make your CV stand out from the competition."
      },
      {
        icon: Palette,
        title: "Swedish Design",
        description: "Minimalist, professional templates that appeal to modern employers in the Swedish and international market."
      }
  ];

  const pricingTiers = [
    {
      name: "Gratis",
      price: "0 kr",
      description: "Perfect for getting started.",
      features: [
        "1 Grundläggande CV-mall",
        "Standardformatering",
        "PDF-nedladdning",
        "Grundläggande support"
      ],
      cta: "Börja gratis",
      buttonVariant: "outline" as const
    },
    {
      name: "Premium",
      price: "99 kr",
      description: "For professionals who want to stand out.",
      features: [
        "Alla professionella mallar",
        "ATS-optimering",
        "AI-drivna innehållsförslag",
        "Anpassningsbara färger & typsnitt",
        "Personligt brev-generator",
        "Premium support"
      ],
      cta: "Välj Premium",
      isPopular: true
    },
    {
      name: "Pro",
      price: "199 kr",
      description: "For the ultimate career advantage.",
      features: [
        "Allt i Premium",
        "LinkedIn-profiloptimering",
        "1-till-1 Karriärcoaching (30min/mån)",
        "Branschspecifika mallar",
        "Prioriterad support"
      ],
      cta: "Välj Pro"
    }
  ];

  const testimonials = [
    {
      name: "Anna S.",
      role: "Project Manager",
      company: "Tech Solutions",
      content: "The AI tips helped me rephrase my experience in a much more impactful way. I landed my dream job a week after sending out my new CV!",
      rating: 5
    },
    {
      name: "Erik J.",
      role: "UX Designer",
      company: "Creative Minds",
      content: "I love the templates! They are modern, clean, and really easy to customize. Finally, a CV I'm proud to share.",
      rating: 5
    },
    {
      name: "Maria K.",
      role: "Recent Graduate",
      company: "Stockholm University",
      content: "As a new graduate, I wasn't sure where to start. CV Craft made the whole process simple and stress-free. Highly recommended!",
      rating: 5
    }
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/editor" className="text-sm font-medium text-muted-foreground hover:text-primary">{t('nav.create_cv')}</Link>
          <Link href="/cover-letter" className="text-sm font-medium text-muted-foreground hover:text-primary">Cover Letter</Link>
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
                <Link href="/cover-letter" className="text-lg font-medium text-muted-foreground hover:text-primary">Cover Letter</Link>
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

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Skapa ett <span className="text-primary">ATS-optimerat CV</span> som får dig anställd
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Bygg professionella CV:n som passerar automatiska filter och imponerar på rekryterare. Svenskdesignade mallar med experttips för den svenska arbetsmarknaden.
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <Link href="/editor">
                <Button size="lg">{t('hero.cta')}</Button>
              </Link>
               <Link href="/templates">
                <Button size="lg" variant="outline">Se exempel-CV</Button>
              </Link>
            </div>
            <div className="max-w-4xl mx-auto p-8 bg-card/50 rounded-2xl shadow-lg">
                <Image 
                    src="https://placehold.co/1200x600.png"
                    width={1200}
                    height={600}
                    alt="CV template example"
                    data-ai-hint="resume document"
                    className="rounded-xl"
                />
            </div>
          </div>
        </section>

        {/* Start Cards Section */}
        <CVStartCards />
       
        {/* Why Choose Us Section */}
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Varför välja CV Craft?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Vi kombinerar svensk design med kraftfull AI för att ge dig de bästa förutsättningarna.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {features.map(feature => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <feature.icon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Välj din plan</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Börja gratis eller uppgradera för att få tillgång till alla våra kraftfulla verktyg.
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                    {pricingTiers.map(tier => (
                        <PricingCard key={tier.name} tier={tier} />
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('testimonials.title')}</h2>
                     <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('testimonials.subtitle')}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map(testimonial => (
                        <TestimonialCard key={testimonial.name} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
        
        {/* FAQ Section */}
        <FAQ />
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

    