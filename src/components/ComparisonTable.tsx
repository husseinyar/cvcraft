
"use client";
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    { feature: 'Antal CV-mallar', gratis: '1 Grundläggande', premium: 'Alla Professionella', pro: 'Alla Professionella' },
    { feature: 'ATS-optimering', gratis: false, premium: true, pro: true },
    { feature: 'Experttips & AI-hjälp', gratis: false, premium: true, pro: true },
    { feature: 'Anpassade färger & typsnitt', gratis: false, premium: true, pro: true },
    { feature: 'Personligt brev-generator', gratis: false, premium: false, pro: true },
    { feature: 'LinkedIn-profiloptimering', gratis: false, premium: false, pro: true },
    { feature: '1-till-1 Karriärcoaching', gratis: false, premium: false, pro: true },
    { feature: 'Obegränsade nedladdningar', gratis: true, premium: true, pro: true },
];

export function ComparisonTable() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="heading-lg mb-6">Jämför våra planer</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Hitta den perfekta planen för din karriärresa.
                    </p>
                </div>
                <Card className="max-w-5xl mx-auto">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-6 font-semibold">Funktioner</th>
                                        <th className="p-6 font-semibold text-center">Gratis</th>
                                        <th className="p-6 font-semibold text-center">Premium</th>
                                        <th className="p-6 font-semibold text-center">Pro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((item, index) => (
                                        <tr key={index} className="border-b last:border-0">
                                            <td className="p-6 font-medium">{item.feature}</td>
                                            <td className="p-6 text-center">
                                                {typeof item.gratis === 'boolean' ? (
                                                    item.gratis ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-destructive" />
                                                ) : <span className="text-sm">{item.gratis}</span>}
                                            </td>
                                            <td className="p-6 text-center">
                                                {typeof item.premium === 'boolean' ? (
                                                    item.premium ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-destructive" />
                                                ) : <span className="text-sm">{item.premium}</span>}
                                            </td>
                                            <td className="p-6 text-center">
                                                {typeof item.pro === 'boolean' ? (
                                                    item.pro ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-destructive" />
                                                ) : <span className="text-sm">{item.pro}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

    

    