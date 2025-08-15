
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import sv from '@/locales/sv.json';

type Locale = 'en' | 'sv';

const translations = { en, sv };

// Helper to get nested keys
type NestedKey<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${'' extends NestedKey<T[K]> ? '' : '.'}${NestedKey<T[K]>}` }[keyof T]
  : '';
  
type TranslationKey = NestedKey<typeof en>;


interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Locale>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language') as Locale;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sv')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Locale) => {
    setLanguage(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
    }
  };
  
  const t = (key: TranslationKey): string => {
    const currentLanguage = isClient ? language : 'en'; // Default to 'en' on server and initial client render
    const keys = key.split('.');
    let result: any = translations[currentLanguage];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            // Fallback to English if translation is missing
            let fallbackResult: any = translations.en;
            for(const fk of keys) {
                fallbackResult = fallbackResult?.[fk];
            }
            return fallbackResult || key;
        }
    }
    return result || key;
  };


  if (!isClient) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
