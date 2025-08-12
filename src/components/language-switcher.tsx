
"use client";

import { useTranslation } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} disabled={language === 'en'}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("sv")} disabled={language === 'sv'}>
          Svenska
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
