import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { StarsBackground } from "@/components/ui/stars-background";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Bodleian Void",
  description: "AI generated book recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} antialiased`}
      >
        <StarsBackground />
        <div className="h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
