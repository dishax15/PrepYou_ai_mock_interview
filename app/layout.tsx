import type { Metadata } from "next";
import { Mona_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const monasans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PrepYou",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body
       className={`${monasans.className} antialiased pattern`}
       >
        {children}

        <Toaster/>
      </body>
    </html>
  );
}
