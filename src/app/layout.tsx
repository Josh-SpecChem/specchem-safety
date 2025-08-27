import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { ProgressProvider } from "@/contexts/ProgressContext";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "SpecChem LMS - Professional Training Platform",
  description: "Empowering SpecChem professionals through comprehensive training on safety, compliance, and operational excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className={inter.className}>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
