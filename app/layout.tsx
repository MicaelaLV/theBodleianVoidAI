import type { Metadata } from "next";
import { Fraunces, Epilogue } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces-serif",
  subsets: ["latin"],
});

const epilogue = Epilogue({
  variable: "--font-epilogue-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Librarian",
  description: "Void generated book recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
