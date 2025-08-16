
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Är CV Craft verkligen gratis?",
    answer: "Ja, vår grundläggande plan är helt gratis och låter dig skapa ett professionellt CV med en av våra standardmallar. För mer avancerade funktioner som ATS-optimering och fler mallar erbjuder vi Premium- och Pro-planer.",
  },
  {
    question: "Vad är ATS och varför är det viktigt?",
    answer: "ATS står för Applicant Tracking System. Det är en programvara som många företag använder för att automatiskt sortera och filtrera CV:n. Våra mallar är optimerade för att enkelt kunna läsas av dessa system, vilket ökar chansen att ditt CV når en mänsklig rekryterare.",
  },
  {
    question: "Kan jag anpassa mallarna?",
    answer: "Absolut! Med våra Premium- och Pro-planer kan du anpassa färger, typsnitt och layout för att skapa ett unikt CV som speglar din personlighet och bransch.",
  },
  {
    question: "Hur fungerar karriärcoachingen i Pro-planen?",
    answer: "I Pro-planen ingår ett 30-minuters videosamtal per månad med en av våra erfarna karriärcoacher. De kan hjälpa dig med allt från att vässa ditt CV och personliga brev till att förbereda dig för intervjuer.",
  },
];

export function FAQ() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6">Vanliga frågor</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Här hittar du svar på de vanligaste funderingarna våra användare har.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

    