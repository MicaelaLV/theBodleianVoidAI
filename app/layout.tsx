import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue-sans",
  subsets: ["latin"],
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
        className={`${epilogue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
