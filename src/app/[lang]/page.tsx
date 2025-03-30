"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

// English components
import EnHero from "@/components/Hero/EnHero";
import EnProcess from "@/components/Process/EnProcess";
import EnServices from "@/components/Services/EnServices";

// Farsi components
import FaHero from "@/components/Hero/Hero"; // Using existing Farsi components
import FaProcess from "@/components/Process/Process";
import FaServices from "@/components/Services/Services";

function HomeContent() {
  // Get the language from URL params
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  // For client components that need language context
  const isRTL = lang === 'fa';

  return (
    <main className="relative">
      {lang === 'fa' ? (
        <>
          <FaHero />
          <FaServices />
          <FaProcess />
        </>
      ) : (
        <>
          <EnHero />
          <EnServices />
          <EnProcess />
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#ffa620]" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
} 