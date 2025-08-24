
"use client";

import React, { ReactNode } from 'react';
import type { CVTheme } from '@/types';

interface CvStyleProviderProps {
  theme: CVTheme;
  children: ReactNode;
}

export default function CvStyleProvider({ theme, children }: CvStyleProviderProps) {
  const { primaryColor, fontSize } = theme;

  // Use a unique class to scope the variables instead of :root
  const scopeClass = "cv-theme-provider";

  const style = `
    .${scopeClass} {
      --cv-primary-color: ${primaryColor};
      --cv-font-size-base: ${fontSize}px;
      --cv-font-size-sm: ${fontSize * 0.85}px;
      --cv-font-size-lg: ${fontSize * 1.15}px;
      --cv-font-size-xl: ${fontSize * 1.5}px;
      --cv-font-size-xxl: ${fontSize * 2}px;
    }
  `;

  return (
    <div className={scopeClass}>
      <style>{style}</style>
      {children}
    </div>
  );
}
