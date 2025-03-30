import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mirza AI Agency",
  description: "Smart business automation",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
