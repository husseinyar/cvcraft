
"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/context/language-context';
import { Mail, Phone, MapPin } from 'lucide-react';
import SiteLayout from '@/components/site-layout';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <SiteLayout activeLink="contact">
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
    </SiteLayout>
  );
}
