import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "UniClubs",
  description: "University Clubs Management Platform",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={cn("dark font-sans", inter.variable)}>
      <body>
      <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-500 focus:text-[#0d1b2a] focus:font-semibold"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        {children}
      </main>
      </body>
      </html>
  );
}