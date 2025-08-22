
"use client";

import type { CVData } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CvEditor from "./cv-editor";
import { useTranslation } from "@/context/language-context";

interface EditCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
  cvPreviewRef: React.RefObject<HTMLDivElement>;
}

export default function EditCvModal({ isOpen, onClose, cvData, setCvData }: EditCvModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('editor.title')}</DialogTitle>
          <DialogDescription>
            {t('editor.header.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
           <CvEditor cvData={cvData} setCvData={setCvData} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
