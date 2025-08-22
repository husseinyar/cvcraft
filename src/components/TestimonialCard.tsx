
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export function TestimonialCard({ name, role, company, content, rating }: TestimonialCardProps) {
  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={`https://placehold.co/40x40.png`} alt={name} data-ai-hint="person portrait"/>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role} at {company}</p>
          </div>
        </div>
        <div className="flex mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}
            />
          ))}
        </div>
        <p className="text-muted-foreground italic">"{content}"</p>
      </CardContent>
    </Card>
  );
}

    

    