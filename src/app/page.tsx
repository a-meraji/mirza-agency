"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";


// Farsi components
import Hero from "@/components/Hero/Hero"; // Using existing Farsi components
import Process from "@/components/Process/Process";
import Services from "@/components/Services/Services";
import AutomateScroll from "@/components/AutomateScroll";

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#ffa620]" />
      </div>
    }>
      <main className="relative">

<Hero />
<AutomateScroll />
<Services />
<Process />

</main>
    </Suspense>
  );
} 