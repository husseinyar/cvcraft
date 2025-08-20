
"use client";

import type { CVData } from "@/types";
import ProfessionalTemplate from "./templates/professional";
import CreativeTemplate from "./templates/creative";
import MinimalTemplate from "./templates/minimal";
import OtagoTemplate from "./templates/otago";
import HarvardTemplate from "./templates/harvard";
import PrincetonTemplate from "./templates/princeton";
import OnyxTemplate from "./templates/onyx";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";


interface TemplatePreviewProps {
  cvData: CVData;
}

const TemplatePreview = React.forwardRef<HTMLDivElement, TemplatePreviewProps>(({ cvData }, ref) => {
  const renderTemplate = () => {
    switch (cvData.template) {
      case "onyx":
        return <OnyxTemplate data={cvData} />;
      case "professional":
        return <ProfessionalTemplate data={cvData} />;
      case "creative":
        return <CreativeTemplate data={cvData} />;
      case "minimal":
        return <MinimalTemplate data={cvData} />;
      case "otago":
        return <OtagoTemplate data={cvData} />;
      case "harvard":
        return <HarvardTemplate data={cvData} />;
      case "princeton":
        return <PrincetonTemplate data={cvData} />;
      case "auckland":
      case "edinburgh":
      case "berkeley":
         // Fallback to a default template for new names
        return <OtagoTemplate data={cvData} />;
      default:
        return <OnyxTemplate data={cvData} />;
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-0">
        <div ref={ref} className="bg-white transition-all duration-300 ease-in-out">
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
});

TemplatePreview.displayName = "TemplatePreview";

export default TemplatePreview;
