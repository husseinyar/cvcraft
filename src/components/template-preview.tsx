"use client";

import type { CVData } from "@/types";
import ProfessionalTemplate from "./templates/professional";
import CreativeTemplate from "./templates/creative";
import MinimalTemplate from "./templates/minimal";
import { Card, CardContent } from "@/components/ui/card";

interface TemplatePreviewProps {
  cvData: CVData;
}

export default function TemplatePreview({ cvData }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (cvData.template) {
      case "professional":
        return <ProfessionalTemplate data={cvData} />;
      case "creative":
        return <CreativeTemplate data={cvData} />;
      case "minimal":
        return <MinimalTemplate data={cvData} />;
      default:
        return <ProfessionalTemplate data={cvData} />;
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-0">
        <div className="aspect-[8.5/11] w-full bg-white transition-all duration-300 ease-in-out">
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
}
