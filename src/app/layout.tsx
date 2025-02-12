import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/UI/Navbar";
import ContactUs from "@/components/UI/ContactUs";
import Loader from "@/components/UI/Loader";
import { LoadingProvider } from "@/context/LoadingContext";
import SmoothScroll from "@/components/SmoothScroll";

const IRANSansWeb = localFont({
  src: [
    {
      path: "./fonts/IRANSansWeb_Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/IRANSansWeb_Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/IRANSansWeb.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-iransans", // Define CSS variable for the font
  display: "swap",
});

const AkharinKhabar = localFont({
  src: [
    {
      path: "./fonts/AkharinKhabar(Bold).otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/AkharinKhabar(Regular).ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AkharinKhabar(Thin).ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-akharinkhabar", // Define CSS variable for the second font
  display: "swap",
});


export const metadata: Metadata = {
  title: "میرزا | توسعه دهنده وب",
  description: "ارائه راهکار های فنی مختص فروشگاه های اینترنتی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="fa-IR">
      <LoadingProvider>
      <body
        className={`${IRANSansWeb.variable} ${AkharinKhabar.variable} antialiased`}
      >

        <Loader />
        <div className="bg-[#fce0c5] -z-10 bg-grid-black/[0.2] fixed top-0 bottom-0 left-0 right-0 h-screen flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        <SmoothScroll/>
        <Navbar />
        {children}
        <ContactUs />
      </body>
      </LoadingProvider>
    </html>
  );
}
