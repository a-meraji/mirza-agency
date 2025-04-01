'use client';

import { useSubdomain } from '@/hooks/useSubdomain';
import {  Varela} from 'next/font/google';
import localFont from "next/font/local";

// Font definitions
const IRANSansWeb = localFont({
  src: [
    {
      path: "../app/fonts/IRANSansWeb_Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/IRANSansWeb_Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/IRANSansWeb.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-iransans",
  display: "swap",
});

const AkharinKhabar = localFont({
  src: [
    {
      path: "../app/fonts/AkharinKhabar(Bold).otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/AkharinKhabar(Regular).ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/AkharinKhabar(Thin).ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-akharinkhabar",
  display: "swap",
});

const varela = Varela({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-varela',
});

type Props = {
  children: React.ReactNode;
};

export default function LanguageProvider({ children }: Props) {
  const { hasFaSubdomain, isLoading } = useSubdomain();
  
  if (isLoading) {
    // You can add a loading state here if needed
    return null;
  }

  // Set html attributes based on language
  const lang = hasFaSubdomain ? 'fa' : 'en';
  const isRTL = lang === 'fa';
  
  // Update html attributes
  if (typeof document !== 'undefined') {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'fa' ? 'fa-IR' : 'en';
  }

  const getFontClasses = () => {
    if (lang === 'fa') {
      return `${IRANSansWeb.className} ${AkharinKhabar.variable}`;
    } else {
      return `${varela.className}`;
    }
  };

  return (
    <div className={`${getFontClasses()}`}>
      {children}
    </div>
  );
} 