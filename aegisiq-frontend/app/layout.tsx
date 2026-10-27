import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// 1. Context-a import pannunga
import { AegisProvider } from "./context/AegisContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AegisIQ | Industrial Asset Intelligence Platform",
  description: "AI-Powered Industrial Asset Monitoring & Predictive Maintenance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-[#0d6963]/20 selection:text-[#0d6963]">
        {/* 2. Inga AegisProvider-a wrap pannunga */}
        <AegisProvider>
          {children}
        </AegisProvider>
      </body>
    </html>
  );
}
