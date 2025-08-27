
"use client"
import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth-button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { Skeleton } from './ui/skeleton';
import { useCV } from '@/context/cv-context';
import { Badge } from './ui/badge';

interface NavLink {
    href: string;
    labelKey: 'nav.create_cv' | 'nav.templates' | 'nav.blog' | 'nav.pricing' | 'nav.contact' | 'footer.features';
    id: 'editor' | 'cover-letter' | 'applications' | 'templates' | 'blog' | 'pricing' | 'contact' | 'features';
    label: string;
}

interface SiteLayoutProps {
  children: ReactNode;
  activeLink?: NavLink['id'];
}

// Quick fix for cover letter labelKey
const getLabel = (link: NavLink, t: (key: any) => string) => {
    if (link.id === 'cover-letter') return "Cover Letter";
    if (link.id === 'applications') return "Applications";
    return t(link.labelKey);
}

const navLinks: NavLink[] = [
    { href: "/editor", labelKey: "nav.create_cv", id: "editor", label: "Create CV" },
    { href: "/applications", label: "Applications", id: "applications", labelKey: "nav.create_cv" }, // Placeholder labelkey
    { href: "/cover-letter", label: "Cover Letter", id: "cover-letter", labelKey: "nav.create_cv" }, // Placeholder labelkey
    { href: "/templates", labelKey: "nav.templates", id: "templates", label: "Templates" },
    { href: "/blog", labelKey: "nav.blog", id: "blog", label: "Blog" },
    { href: "/pricing", labelKey: "nav.pricing", id: "pricing", label: "Pricing" },
    { href: "/contact", labelKey: "nav.contact", id: "contact", label: "Contact" },
];


export default function SiteLayout({ children, activeLink }: SiteLayoutProps) {
  const { t } = useTranslation();
  const { user } = useCV();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
 
  const getRoleBadgeVariant = (role: string | undefined) => {
    switch (role) {
      case 'premium': return 'default';
      case 'pro': return 'destructive'; // Or another distinct color
      case 'admin': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link href="/" className="text-2xl font-bold text-primary">CV Craft</Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex gap-6 items-center">
             {navLinks.map(link => (
             <Link 
                key={link.id} 
                href={link.href} 
                className={cn(
                    "text-sm font-medium hover:text-primary",
                    activeLink === link.id ? "text-primary" : "text-muted-foreground"
                )}>
                {getLabel(link, t)}
             </Link>
          ))}
            {isMounted && user && <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>}
            <AuthButton />
            <LanguageSwitcher />
            <ThemeToggle />
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
            <AuthButton />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col gap-6 pt-12">
                        {isMounted && user && <Badge variant={getRoleBadgeVariant(user.role)} className="w-fit">{user.role}</Badge>}
                        {navLinks.map(link => (
                            <Link 
                                key={link.id} 
                                href={link.href} 
                                className={cn(
                                    "text-lg font-medium hover:text-primary",
                                    activeLink === link.id ? "text-primary" : "text-muted-foreground"
                                )}>
                                {getLabel(link, t)}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex gap-4 pt-8">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </header>

      <main className="flex-grow">
        {children}
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
