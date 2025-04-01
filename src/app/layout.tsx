import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Nabar/Navbar";
import ContactUs from "@/components/UI/ContactUs";
import Footer from "@/components/UI/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import LanguageProvider from "@/components/LanguageProvider";
import ChatWidget from "@/components/ChatWidget";
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
          {/* <ChatWidget /> */}
        </LanguageProvider>
        <Script id="chat-widget-config" strategy="afterInteractive">
          {`
            window.ChatWidgetConfig = {
                webhook: {
                    url: 'https://n8n-mirza.chbk.app/webhook/81949654-1168-416f-b329-ccffbac93170/chat',
                    route: 'general'
                },
                branding: {
                    logo: 'http://mirza.solutions/logo.svg',
                    name: 'Mirza AI automation agency',
                    welcomeText: 'Hi 👋, how can we help?',
                    responseTimeText: 'We typically respond right away'
                },
                style: {
                    primaryColor: '#ffc164',
                    secondaryColor: '#ffa620',
                    position: 'right',
                    backgroundColor: '#ffffff',
                    fontColor: '#333333'
                }
            };
          `}
        </Script>
        <Script 
          src="https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@ba944c3/chat-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
