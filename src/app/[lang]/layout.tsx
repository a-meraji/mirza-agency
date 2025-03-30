import { ClientProviders } from "@/components/ClientProviders";
import Navbar from "@/components/Nabar/Navbar";
import ContactUs from "@/components/UI/ContactUs";
import Footer from "@/components/UI/Footer";
import ChatWidget from "@/components/ChatWidget";
import SmoothScroll from "@/components/SmoothScroll";
import { Roboto } from 'next/font/google';
import localFont from "next/font/local";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fa" }];
}

// Font definitions
const IRANSansWeb = localFont({
  src: [
    {
      path: "../fonts/IRANSansWeb_Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansWeb_Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/IRANSansWeb.ttf",
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
      path: "../fonts/AkharinKhabar(Bold).otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/AkharinKhabar(Regular).ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AkharinKhabar(Thin).ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-akharinkhabar",
  display: "swap",
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Generate metadata based on the language
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  
  return {
    title: lang === 'fa' ? "میرزا | آژانس هوش مصنوعی" : "Mirza | AI Agency",
    description: lang === 'fa' ? "اتوماسیون هوشمند کسب و کارها" : "Smart business automation",
  };
}

export default function LangLayout({ 
  children,
  params,
}: Props) {
  const lang = params.lang;
  const isRTL = lang === 'fa';

  // Apply different styles based on language
  const getFontClasses = () => {
    if (lang === 'fa') {
      return `${IRANSansWeb.variable} ${AkharinKhabar.variable}`;
    } else {
      return `${roboto.variable}`;
    }
  };

  return (
    <html dir={isRTL ? "rtl" : "ltr"} lang={lang === 'fa' ? 'fa-IR' : 'en'}>
      <body className={`${getFontClasses()} antialiased`}>
        <ClientProviders lang={lang}>
          <div className="bg-[#fce0c5] -z-10 bg-grid-black/[0.2] fixed top-0 bottom-0 left-0 right-0 h-screen flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          <SmoothScroll />
          <Navbar />
          {children}
          <ContactUs />
          <Footer />
          <ChatWidget />
        </ClientProviders>
      </body>
    </html>
  );
} 