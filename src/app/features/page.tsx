
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/language-context';
import { Bot, Palette, FileText, CheckCircle, Clock, Share2 } from 'lucide-react';
import SiteLayout from '@/components/site-layout';

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
    <SiteLayout>
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
    </SiteLayout>
  );
}
