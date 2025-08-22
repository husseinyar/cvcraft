
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  isPopular?: boolean;
};

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <Card className={cn("flex flex-col hover-lift", tier.isPopular && "border-primary shadow-strong relative")}>
      {tier.isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Popular</Badge>}
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div>
          <span className="text-4xl font-bold">{tier.price}</span>
          <span className="text-muted-foreground">/månad</span>
        </div>
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="/editor" className="w-full">
            <Button className="w-full" variant={tier.buttonVariant || 'default'}>
            {tier.cta}
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

    

    