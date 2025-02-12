import Hero from "@/components/Hero/Hero";
import Process from "@/components/Process/Process";
import Services from "@/components/Services/Services";

export default function Home() {

  return (
    <main className="relative">
      <Hero />
      <Services />
      <Process />
    </main>
  );
}
