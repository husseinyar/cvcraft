
"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, Copy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CVStartCards() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <FilePlus className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Skapa från grunden</h3>
              <p className="text-muted-foreground mb-6">Börja med ett tomt dokument och bygg ditt CV steg för steg med vår guide.</p>
              <Link href="/editor">
                <Button>
                    Börja nu <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Copy className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Välj en mall</h3>
              <p className="text-muted-foreground mb-6">Utforska våra professionellt designade mallar för att snabbt komma igång.</p>
              <Link href="/templates">
                 <Button>
                    Se mallar <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
