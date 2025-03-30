"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function ClientProviders({ 
  children, 
  lang 
}: { 
  children: ReactNode; 
  lang: string;
}) {
  return (
    <LanguageProvider initialLanguage={lang as 'en' | 'fa'}>
      {children}
    </LanguageProvider>
  );
} 