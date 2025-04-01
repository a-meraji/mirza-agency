import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Nabar/Navbar";
import ContactUs from "@/components/UI/ContactUs";
import Footer from "@/components/UI/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import LanguageProvider from "@/components/LanguageProvider";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fa" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  
  return {
    title: lang === 'fa' ? "میرزا | آژانس هوش مصنوعی" : "Mirza | AI Agency",
    description: lang === 'fa' ? "اتوماسیون هوشمند کسب و کارها" : "Smart business automation",
    icons: {
      icon: "/logo.svg",
      shortcut: "/logo.svg",
      apple: "/logo.svg",
    },
  };
}

export default function RootLayout({
  children,
  params,
}: Props) {
  return (
    <html>
      <body className="antialiased">
        <LanguageProvider>
          <div className="bg-[#fce0c5] -z-10 bg-grid-black/[0.2] fixed top-0 bottom-0 left-0 right-0 h-screen flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          <SmoothScroll />
          <Navbar />
          {children}
          <ContactUs />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
