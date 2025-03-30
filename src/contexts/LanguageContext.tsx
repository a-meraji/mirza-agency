"use client"
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Define translation type for type safety
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English and Farsi translations
const translations: Translations = {
  en: {
    'home': 'Home',
    'about': 'About',
    'services': 'Services',
    'blog': 'Blog',
    'contact': 'Contact',
    'heroTitle': 'AI Agency for Modern Businesses',
    'heroSubtitle': 'We provide intelligent solutions that automate and enhance your business operations',
    'readMore': 'Read More',
    'getStarted': 'Get Started',
    // Add more translations as needed
  },
  fa: {
    'home': 'خانه',
    'about': 'درباره ما',
    'services': 'خدمات',
    'blog': 'وبلاگ',
    'contact': 'تماس با ما',
    'heroTitle': 'آژانس هوش مصنوعی برای کسب و کارهای مدرن',
    'heroSubtitle': 'ما راهکارهای هوشمندی ارائه می‌دهیم که عملیات کسب و کار شما را خودکار و بهبود می‌بخشد',
    'readMore': 'بیشتر بخوانید',
    'getStarted': 'شروع کنید',
    // Add more translations as needed
  }
};

export const LanguageProvider = ({ children, initialLanguage = 'en' }: { children: ReactNode, initialLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const router = useRouter();
  const pathname = usePathname();
  
  // Initialize language from URL on client-side
  useEffect(() => {
    // This ensures we don't run this in SSR
    const currentPath = pathname.split('/');
    if (currentPath.length > 1) {
      const langFromPath = currentPath[1];
      if (langFromPath === 'en' || langFromPath === 'fa') {
        setLanguage(langFromPath);
      }
    }
  }, [pathname]);
  
  // Check if the current language is RTL
  const isRTL = language === 'fa';
  
  // Function to change the language
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    
    // Get the current path without the language prefix
    const pathParts = pathname.split('/');
    pathParts[1] = lang; // Replace the language part
    const newPath = pathParts.join('/');
    
    // Use Next.js Router for client-side navigation
    router.push(newPath);
  };
  
  // Translation function
  const t = (key: string) => {
    if (!translations[language] || !translations[language][key]) {
      return key;
    }
    return translations[language][key];
  };
  
  // Provide the language context value
  const contextValue = {
    language,
    changeLanguage,
    t,
    isRTL
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for accessing the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 