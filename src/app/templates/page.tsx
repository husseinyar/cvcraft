
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from '@/context/language-context';
import type { TemplateOption } from '@/types';
import SiteLayout from '@/components/site-layout';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TemplatesPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const templates: { name: TemplateOption, hint: string }[] = [
    { name: 'otago', hint: 'resume otago' },
    { name: 'harvard', hint: 'resume harvard' },
    { name: 'princeton', hint: 'resume princeton' },
    { name: 'auckland', hint: 'resume auckland' },
    { name: 'edinburgh', hint: 'resume edinburgh' },
    { name: 'berkeley', hint: 'resume berkeley' },
  ];

  return (
    <SiteLayout activeLink="templates">
      <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('templates.title')}</h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">{t('templates.subtitle')}</p>
              
              {!isMounted ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <Skeleton className="h-[550px] w-full" />
                      <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                      <Skeleton className="h-8 w-1/3 mx-auto mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
          </div>
      </section>
    </SiteLayout>
  );
}
