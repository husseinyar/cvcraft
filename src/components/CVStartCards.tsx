
"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, Copy, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

export default function CVStartCards() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <FilePlus className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{t('cv_start_cards.from_scratch.title')}</h3>
              <p className="text-muted-foreground mb-6 h-24">{t('cv_start_cards.from_scratch.description')}</p>
              <Link href="/editor">
                <Button>
                    {t('cv_start_cards.from_scratch.cta')} <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
           <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Upload className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{t('cv_start_cards.upload.title')}</h3>
              <p className="text-muted-foreground mb-6 h-24">{t('cv_start_cards.upload.description')}</p>
              <Link href="/upload">
                <Button>
                    {t('cv_start_cards.upload.cta')} <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Copy className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{t('cv_start_cards.from_template.title')}</h3>
              <p className="text-muted-foreground mb-6 h-24">{t('cv_start_cards.from_template.description')}</p>
              <Link href="/templates">
                 <Button>
                    {t('cv_start_cards.from_template.cta')} <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
