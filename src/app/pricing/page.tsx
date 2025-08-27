
"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';
import { Check } from 'lucide-react';
import SiteLayout from '@/components/site-layout';
import { useCV } from '@/context/cv-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricingPage() {
  const { t } = useTranslation();
  const { user, setUser } = useCV();
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChoosePlan = (plan: 'premium' | 'pro') => {
    if (!user) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to choose a plan.",
        variant: "destructive"
      });
      return;
    }
    // In a real app, this would redirect to a Stripe checkout page.
    // Here, we'll simulate the upgrade.
    setUser({ ...user, role: plan });
    toast({
      title: "Plan Updated!",
      description: `You are now on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
    });
    router.push('/editor');
  };


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
      cta: "pricing_page.free.cta",
      action: () => router.push('/editor'),
      variant: "outline" as const,
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
      cta: "pricing_page.pro.cta",
      action: () => handleChoosePlan('premium'),
      isPopular: true,
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
      cta: "pricing_page.business.cta",
      action: () => handleChoosePlan('pro'),
    }
  ];

  return (
    <SiteLayout activeLink="pricing">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricing_page.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('pricing_page.subtitle')}</p>
          </div>
          
          {!isMounted ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                    </Card>
                ))}
             </div>
          ) : (
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
                  <CardFooter>
                    <Button className="w-full" onClick={tier.action} variant={tier.variant}>
                      {t(tier.cta as any)}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
